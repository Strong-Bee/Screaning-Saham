import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 1. Baca Database Saham dari folder public
    const jsonPath = path.join(process.cwd(), 'public', 'saham_target.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const sahamList = JSON.parse(rawData);

    // 2. Ambil 20 saham pertama (untuk menghindari limit/timeout Vercel)
    const targetSaham = sahamList.slice(0, 20);
    
    const results = await Promise.all(
      targetSaham.map(async (s: any) => {
        try {
          const ticker = `${s.Kode}.JK`;
          
          // Ambil data historical untuk hitung RSI sederhana
          const queryOptions = { period1: '2025-12-01', interval: '1d' as any };
          const history = await yahooFinance.chart(ticker, queryOptions);
          
          const quotes = history.quotes;
          if (!quotes || quotes.length < 15) return null;

          const lastQuote = quotes[quotes.length - 1];
          const currPrice = lastQuote.close;

          // Kalkulasi RSI Sederhana (14 Periode)
          let gains = 0;
          let losses = 0;
          for (let i = quotes.length - 14; i < quotes.length; i++) {
            const diff = (quotes[i].close || 0) - (quotes[i-1].close || 0);
            if (diff >= 0) gains += diff;
            else losses -= diff;
          }
          const rs = gains / losses;
          const rsi = 100 - (100 / (1 + rs));

          // Logika Signal Lintang-GPT
          let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
          if (rsi < 35) signal = 'BUY';
          else if (rsi > 75) signal = 'SELL';

          return {
            kode: s.Kode,
            nama: s["Nama Perusahaan"],
            price: currPrice,
            rsi: Math.round(rsi),
            signal: signal
          };
        } catch (err) {
          return null;
        }
      })
    );

    // Filter data yang gagal di-fetch
    const finalData = results.filter(item => item !== null);

    return NextResponse.json(finalData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}