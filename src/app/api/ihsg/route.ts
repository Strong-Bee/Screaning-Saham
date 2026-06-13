import { NextResponse } from "next/server";

// Yahoo Finance API – gratis & open (simbol ^JKSE untuk IHSG)
const YAHOO_API = "https://query1.finance.yahoo.com/v8/finance/chart/^JKSE";

export async function GET() {
  try {
    // Ambil data intraday 1 hari agar dapat high/low/volume
    const url = `${YAHOO_API}?interval=5m&range=1d&includePrePost=false`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 60 }, // cache 60 detik
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const result = json.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators.quote[0];

    // Harga terakhir
    const price = meta.regularMarketPrice;
    // Perubahan
    const previousClose = meta.chartPreviousClose || meta.previousClose || 0;
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;

    // High & Low dari data intraday
    const dayHigh = Math.max(...quote.high.filter((v: any) => v != null));
    const dayLow = Math.min(...quote.low.filter((v: any) => v != null));

    // Volume total hari ini (jumlahkan volume per candle)
    const volume = quote.volume
      .filter((v: any) => v != null)
      .reduce((a: number, b: number) => a + b, 0);

    // Waktu terakhir data
    const lastUpdated = new Date(meta.regularMarketTime * 1000).toISOString();

    return NextResponse.json({
      price,
      change,
      changePercent,
      previousClose,
      dayHigh,
      dayLow,
      volume,
      lastUpdated,
      source: "Yahoo Finance",
    });
  } catch (error: any) {
    console.error("IHSG API Error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data" },
      { status: 500 }
    );
  }
}