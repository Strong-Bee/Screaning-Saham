import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 1. Baca Database Saham
    const jsonPath = path.join(process.cwd(), 'public', 'saham_target.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const sahamList = JSON.parse(rawData);

    // Ambil 15-20 saham agar tidak timeout di Vercel (limit 10 detik)
    const targetSaham = sahamList.slice(0, 15);
    
    const results = await Promise.all(
      targetSaham.map(async (s: any) => {
        try {
          const ticker = `${s.Kode}.JK`;
          
          // Ambil data 2 bulan ke belakang agar perhitungan RSI valid
          const today = new Date();
          const twoMonthsAgo = new Date();
          twoMonthsAgo.setMonth(today.getMonth() - 2);

          const history = await yahooFinance.chart(ticker, { 
            period1: twoMonthsAgo, 
            interval: '1d' 
          });
          
          const quotes = history.quotes;
          if (!quotes || quotes.length < 15) return null;

          // Ambil harga penutupan dan bersihkan dari nilai null
          const closePrices = quotes
            .map(q => q.close)
            .filter((c): c is number => c !== null && c !== undefined);

          if (closePrices.length < 15) return null;

          const currPrice = closePrices[closePrices.length - 1];

          // --- KALKULASI RSI 14 PERIODE (Metode Wilder/Sederhana) ---
          let gains = 0;
          let losses = 0;

          for (let i = closePrices.length - 14; i < closePrices.length; i++) {
            const diff = closePrices[i] - closePrices[i - 1];
            if (diff >= 0) gains += diff;
            else losses -= diff;
          }

          let rsi = 50; // Default middle
          if (losses === 0) {
            rsi = 100;
          } else {
            const rs = gains / losses;
            rsi = 100 - (100 / (1 + rs));
          }

          // --- LOGIKA SIGNAL PREDATOR ---
          let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
          if (rsi < 30) signal = 'BUY';      // Oversold
          else if (rsi > 70) signal = 'SELL'; // Overbought

          return {
            kode: s.Kode,
            nama: s["Nama Perusahaan"],
            price: currPrice,
            rsi: Math.round(rsi),
            signal: signal
          };
        } catch (err) {
          console.error(`Gagal fetch ${s.Kode}:`, err);
          return null;
        }
      })
    );

    const finalData = results.filter(item => item !== null);
    return NextResponse.json(finalData);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}