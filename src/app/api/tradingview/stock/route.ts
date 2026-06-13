import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol"); // contoh: TLKM, BBCA

  if (!symbol) {
    return NextResponse.json({ error: "Parameter symbol diperlukan" }, { status: 400 });
  }

  try {
    const tvSymbol = `IDX:${symbol.toUpperCase()}`;
    const res = await fetch(`https://www.tradingview.com/symbols/${tvSymbol}/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    let price: number | null = null;
    let change: number | null = null;
    let changePercent: number | null = null;
    let previousClose: number | null = null;
    let dayHigh: number | null = null;
    let dayLow: number | null = null;
    let volume: number | null = null;

    $("script").each((i, el) => {
      const text = $(el).html();
      if (text && text.includes("regularMarketPrice")) {
        const priceMatch = text.match(/"regularMarketPrice":\s*(\d+\.?\d*)/);
        const changeMatch = text.match(/"regularMarketChange":\s*(-?\d+\.?\d*)/);
        const changePercentMatch = text.match(/"regularMarketChangePercent":\s*(-?\d+\.?\d*)/);
        const previousCloseMatch = text.match(/"previousClose":\s*(\d+\.?\d*)/);
        const dayHighMatch = text.match(/"regularMarketDayHigh":\s*(\d+\.?\d*)/);
        const dayLowMatch = text.match(/"regularMarketDayLow":\s*(\d+\.?\d*)/);
        const volumeMatch = text.match(/"regularMarketVolume":\s*(\d+)/);

        if (priceMatch) price = parseFloat(priceMatch[1]);
        if (changeMatch) change = parseFloat(changeMatch[1]);
        if (changePercentMatch) changePercent = parseFloat(changePercentMatch[1]);
        if (previousCloseMatch) previousClose = parseFloat(previousCloseMatch[1]);
        if (dayHighMatch) dayHigh = parseFloat(dayHighMatch[1]);
        if (dayLowMatch) dayLow = parseFloat(dayLowMatch[1]);
        if (volumeMatch) volume = parseInt(volumeMatch[1]);
        return false;
      }
    });

    if (price == null) throw new Error("Harga tidak ditemukan");

    return NextResponse.json({
      symbol: tvSymbol,
      price,
      change,
      changePercent,
      previousClose,
      dayHigh,
      dayLow,
      volume,
      source: "TradingView",
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("TradingView Stock Error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data" },
      { status: 500 }
    );
  }
}