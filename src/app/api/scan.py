from http.server import BaseHTTPRequestHandler
import json
import os
import yfinance as ticker_library
import pandas as pd
import requests

def send_to_telegram(message):
    token = os.environ.get('TELEGRAM_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if token and chat_id:
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        requests.post(url, data={'chat_id': chat_id, 'text': message, 'parse_mode': 'HTML'})

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # 1. Load data saham dari public/saham_target.json
            # Di Vercel Python, kita akses file via path relatif
            json_path = os.path.join(os.getcwd(), 'public', 'saham_target.json')
            with open(json_path, 'r') as f:
                saham_list = json.load(f)

            target_saham = saham_list[:15] # Ambil 15 saham
            results = []
            buy_signals = []

            for s in target_saham:
                try:
                    kode = s.get('Kode')
                    symbol = f"{kode}.JK"
                    
                    # 2. Ambil data pakai yfinance (lebih stabil dari yahoo-finance2 Node)
                    df = ticker_library.download(symbol, period="3mo", interval="1d", progress=False)
                    
                    if len(df) < 15:
                        continue

                    # 3. Hitung RSI (Cara Pythonic)
                    delta = df['Close'].diff()
                    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
                    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
                    rs = gain / loss
                    rsi = 100 - (100 / (1 + rs))
                    
                    current_rsi = round(rsi.iloc[-1].item(), 2)
                    current_price = int(df['Close'].iloc[-1].item())
                    
                    signal = "HOLD"
                    if current_rsi < 35:
                        signal = "BUY"
                        buy_signals.append(f"✅ <b>{kode}</b>\nPrice: Rp {current_price:,}\nRSI: {current_rsi}")
                    elif current_rsi > 70:
                        signal = "SELL"

                    results.append({
                        "kode": kode,
                        "nama": s.get('Nama Perusahaan', 'N/A'),
                        "price": current_price,
                        "rsi": current_rsi,
                        "signal": signal
                    })
                except Exception as e:
                    print(f"Error scanning {symbol}: {e}")

            # 4. Kirim Telegram jika ada BUY
            if buy_signals:
                msg = "🎯 <b>PYTHON PREDATOR SIGNAL!</b>\n\n" + "\n\n".join(buy_signals)
                send_to_telegram(msg)

            # 5. Response ke Frontend
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(results).encode())

        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode())