import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

async function sendToTelegram(message: string) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

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

export async function GET(request: Request) {
  // Proteksi agar hanya Cron Vercel atau Tuan yang bisa menjalankan
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('authorization');
  
  // Jika dijalankan via Cron, Vercel mengirimkan header Authorization
  if (
    searchParams.get('key') !== process.env.CRON_SECRET && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // Buka komentar di atas jika ingin proteksi ketat
  }

  try {
    const jsonPath = path.join(process.cwd(), 'public', 'saham_target.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const sahamList = JSON.parse(rawData);

    // Ambil 10 saham secara acak atau 10 pertama agar tidak timeout (Max 10 detik di Vercel Free)
    const targetSaham = sahamList.slice(0, 10);
    
    const results = await Promise.all(
      targetSaham.map(async (s: any) => {
        try {
          const ticker = `${s.Kode}.JK`;
          const history = await yahooFinance.chart(ticker, { 
            period1: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 hari terakhir
            interval: '1d' 
          }) as any;
          
          if (!history?.quotes) return null;

          const closePrices = history.quotes
            .map((q: any) => q.close)
            .filter((c: any): c is number => c !== null);

          if (closePrices.length < 15) return null;

          const currPrice = closePrices[closePrices.length - 1];

          // Hitung RSI sederhana
          let gains = 0; let losses = 0;
          for (let i = closePrices.length - 14; i < closePrices.length; i++) {
            const diff = closePrices[i] - closePrices[i - 1];
            if (diff >= 0) gains += diff; else losses -= diff;
          }

          const rs = gains / (losses || 1);
          const rsi = 100 - (100 / (1 + rs));

          let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
          if (rsi < 35) signal = 'BUY';
          else if (rsi > 70) signal = 'SELL';

          return { kode: s.Kode, price: currPrice, rsi: Math.round(rsi), signal };
        } catch { return null; }
      })
    );

    const finalData = results.filter((item): item is any => item !== null);
    const buySignals = finalData.filter(s => s.signal === 'BUY');
    
    if (buySignals.length > 0) {
      let msg = `🎯 <b>PREDATOR AUTO-SCAN</b>\n`;
      msg += `----------------------------------\n`;
      buySignals.forEach(s => {
        msg += `✅ <b>${s.kode}</b> | Rp ${s.price} | RSI: ${s.rsi}\n`;
      });
      await sendToTelegram(msg);
    }

    return NextResponse.json({ success: true, count: finalData.length, buy: buySignals.length });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}