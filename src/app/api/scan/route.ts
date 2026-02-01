import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Fungsi Helper untuk kirim notifikasi ke Telegram
async function sendToTelegram(message: string) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return; // Lewati jika env belum diisi

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.error('Telegram Error:', error);
  }
}

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'saham_target.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const sahamList = JSON.parse(rawData);

    // Tetap 15 saham agar tidak timeout di Vercel
    const targetSaham = sahamList.slice(0, 15);
    
    const results = await Promise.all(
      targetSaham.map(async (s: any) => {
        try {
          const ticker = `${s.Kode}.JK`;
          const today = new Date();
          const twoMonthsAgo = new Date();
          twoMonthsAgo.setMonth(today.getMonth() - 2);

          // @ts-ignore
          const history = await yahooFinance.chart(ticker, { 
            period1: twoMonthsAgo, 
            interval: '1d' 
          }) as any;
          
          if (!history || !history.quotes) return null;

          const closePrices = history.quotes
            .map((q: any) => q.close)
            .filter((c: any): c is number => c !== null && c !== undefined);

          if (closePrices.length < 15) return null;

          const currPrice = closePrices[closePrices.length - 1];

          // Kalkulasi RSI 14 Periode
          let gains = 0;
          let losses = 0;
          for (let i = closePrices.length - 14; i < closePrices.length; i++) {
            const diff = closePrices[i] - closePrices[i - 1];
            if (diff >= 0) gains += diff;
            else losses -= diff;
          }

          let rsi = 50;
          if (losses !== 0) {
            const rs = gains / losses;
            rsi = 100 - (100 / (1 + rs));
          } else if (gains > 0) {
            rsi = 100;
          }

          let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
          if (rsi < 35) signal = 'BUY';
          else if (rsi > 70) signal = 'SELL';

          return {
            kode: s.Kode,
            nama: s["Nama Perusahaan"] || s.nama,
            price: currPrice,
            rsi: Math.round(rsi),
            signal: signal
          };
        } catch (err) {
          return null;
        }
      })
    );

    const finalData = results.filter((item): item is any => item !== null);

    // --- LOGIKA NOTIFIKASI TELEGRAM ---
    const buySignals = finalData.filter(s => s.signal === 'BUY');
    
    if (buySignals.length > 0) {
      let message = `🎯 <b>PREDATOR SIGNAL DETECTED!</b>\n`;
      message += `----------------------------------\n`;
      buySignals.forEach(s => {
        message += `✅ <b>${s.kode}</b>\n`;
        message += `💰 Price: Rp ${s.price.toLocaleString('id-ID')}\n`;
        message += `📊 RSI: ${s.rsi}\n\n`;
      });
      message += `🚀 <i>Segera cek chart, Tuan Lintang!</i>`;
      
      await sendToTelegram(message);
    }

    return NextResponse.json(finalData);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}