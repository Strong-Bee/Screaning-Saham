import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'saham_target.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const sahamList = JSON.parse(rawData);

    // Ambil 15 saham agar aman dari timeout 10 detik Vercel
    const targetSaham = sahamList.slice(0, 15);
    
    const results = await Promise.all(
      targetSaham.map(async (s: any) => {
        try {
          const ticker = `${s.Kode}.JK`;
          const today = new Date();
          const twoMonthsAgo = new Date();
          twoMonthsAgo.setMonth(today.getMonth() - 2);

          // Paksa tipe data ke "any" agar tidak kena Type Error 'never'
          const history: any = await yahooFinance.chart(ticker, { 
            period1: twoMonthsAgo, 
            interval: '1d' 
          });
          
          if (!history || !history.quotes) return null;

          const quotes = history.quotes;

          // Bersihkan data null
          const closePrices = quotes
            .map((q: any) => q.close)
            .filter((c: any): c is number => c !== null && c !== undefined);

          if (closePrices.length < 15) return null;

          const currPrice = closePrices[closePrices.length - 1];

          // Kalkulasi RSI
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

    const finalData = results.filter(item => item !== null);
    return NextResponse.json(finalData);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}