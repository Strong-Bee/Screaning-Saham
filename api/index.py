from flask import Flask, jsonify
import yfinance as yf
import pandas_ta as ta
import json
import os

app = Flask(__name__)

@app.route("/api/scan", methods=['GET'])
def scan():
    try:
        # Load JSON dari folder public
        json_path = os.path.join(os.getcwd(), 'public', 'saham_target.json')
        with open(json_path, 'r') as f:
            data_list = json.load(f)

        results = []
        # Kita scan 15 saham teratas (Vercel Free Tier punya timeout 10 detik)
        for item in data_list[:15]:
            ticker = f"{item['Kode']}.JK"
            stock = yf.Ticker(ticker)
            df = stock.history(period="5d", interval="15m")
            
            if not df.empty and len(df) >= 20:
                # Kalkulasi RSI & EMA
                df['RSI'] = ta.rsi(df['Close'], length=14)
                df['EMA20'] = ta.ema(df['Close'], length=20)
                
                curr_price = float(df['Close'].iloc[-1])
                curr_rsi = float(df['RSI'].iloc[-1])
                ema20 = float(df['EMA20'].iloc[-1])
                curr_vol = float(df['Volume'].iloc[-1])
                avg_vol = float(df['Volume'].tail(10).mean())

                # Logika Signal Lintang-GPT
                signal = "HOLD"
                color = "text-gray-400"
                
                if curr_rsi < 35 and curr_vol > (avg_vol * 1.5):
                    signal = "BUY"
                    color = "text-green-500"
                elif curr_rsi > 75 or curr_price < ema20:
                    signal = "SELL"
                    color = "text-red-500"

                results.append({
                    "kode": item['Kode'],
                    "nama": item['Nama Perusahaan'],
                    "price": curr_price,
                    "rsi": round(curr_rsi, 2),
                    "signal": signal,
                    "color": color
                })

        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500