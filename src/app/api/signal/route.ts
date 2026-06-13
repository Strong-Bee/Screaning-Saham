import { NextResponse } from "next/server";

interface StockSignalResponse {
  symbol: string;
  companyName: string;
  price: number;
  prevClose: number;
  dayChange: number;
  volume: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHist: number;
  recommendation: number;
  score: number;
  action: "STRONG BUY" | "BUY" | "HOLD" | "SELL";
  analysis: {
    technical: string;
    rsi: string;
    momentum: string;
    macd: string;
  };
  source: string;
  timestamp: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolParam = searchParams.get("symbol");

    if (!symbolParam) {
      return NextResponse.json(
        { error: "Parameter 'symbol' wajib diisi" },
        { status: 400 }
      );
    }

    // ==========================
    // SANITIZE SYMBOL
    // ==========================
    const symbol = symbolParam.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (!symbol || symbol.length < 2 || symbol.length > 5) {
      return NextResponse.json(
        { error: "Symbol tidak valid. Contoh: BBCA, TLKM, GOTO, ARTO" },
        { status: 400 }
      );
    }

    // ==========================
    // VARIABEL
    // ==========================
    let currentPrice = 0;
    let dayChange = 0;
    let prevClose = 0;
    let volume = 0;
    let companyName = symbol;

    let rsi = 0;
    let macd = 0;
    let macdSignal = 0;
    let macdHist = 0;
    let recommendation = 0;

    // ==========================
    // 1. YAHOO FINANCE (Price Data)
    // ==========================
    try {
      const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}.JK`;

      const yahooRes = await fetch(yahooUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; LintangPredatorAI/2.1)",
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (yahooRes.ok) {
        const yahooData = await yahooRes.json();
        const quote = yahooData?.quoteResponse?.result?.[0];

        if (quote && quote.regularMarketPrice) {
          currentPrice = quote.regularMarketPrice;
          dayChange = quote.regularMarketChangePercent ?? 0;
          prevClose = quote.regularMarketPreviousClose ?? 0;
          volume = quote.regularMarketVolume ?? 0;
          companyName = quote.shortName || quote.longName || symbol;
        }
      }
    } catch (e) {
      console.warn("Yahoo Finance error:", e);
    }

    if (currentPrice === 0) {
      return NextResponse.json(
        {
          error: `Data tidak ditemukan untuk ${symbol}. Pastikan kode saham benar.`,
          action: "HOLD",
          score: 50,
        },
        { status: 404 }
      );
    }

    // ==========================
    // 2. TRADINGVIEW SCANNER (Technical Indicators)
    // ==========================
    try {
      const tvRes = await fetch(
        "https://scanner.tradingview.com/indonesia/scan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Accept: "application/json",
            "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
            Origin: "https://www.tradingview.com",
            Referer: "https://www.tradingview.com/",
          },
          body: JSON.stringify({
            symbols: {
              tickers: [`IDX:${symbol}`],
              query: { types: [] },
            },
            columns: [
              "Recommend.All",
              "RSI|1D",
              "MACD.macd|1D",
              "MACD.signal|1D",
              "MACD.hist|1D",
            ],
          }),
          cache: "no-store",
        }
      );

      if (tvRes.ok) {
        const tvData = await tvRes.json();

        if (tvData?.data?.[0]?.d && Array.isArray(tvData.data[0].d)) {
          const d = tvData.data[0].d;

          recommendation = d[0] ?? 0;   // Recommend.All
          rsi = d[1] ?? 0;              // RSI
          macd = d[2] ?? 0;             // MACD Line
          macdSignal = d[3] ?? 0;       // MACD Signal
          macdHist = d[4] ?? 0;         // MACD Histogram
        }
      }
    } catch (e: any) {
      console.warn("TradingView fetch failed:", e?.message);
    }

    // ==========================
    // 3. LINTANG PREDATOR AI SCORING
    // ==========================
    let score = 50;

    // === Momentum ===
    if (dayChange > 4) score += 20;
    else if (dayChange > 2) score += 13;
    else if (dayChange > 0.7) score += 6;
    else if (dayChange < -4) score -= 20;
    else if (dayChange < -2.5) score -= 13;
    else if (dayChange < -0.7) score -= 5;

    // === RSI ===
    if (rsi > 0) {
      if (rsi < 30) score += 17;
      else if (rsi < 40) score += 8;
      else if (rsi > 70) score -= 12;
      else if (rsi > 62) score -= 6;
    }

    // === MACD ===
    if (macd > 0 && macdHist > 0) score += 11;
    else if (macd < 0 && macdHist < 0) score -= 7;

    if (macd > macdSignal) score += 7;
    else if (macd < macdSignal) score -= 5;

    // === TradingView Overall Recommendation ===
    score += recommendation * 17;

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    // ==========================
    // 4. DECISION
    // ==========================
    let action: "STRONG BUY" | "BUY" | "HOLD" | "SELL" = "HOLD";

    if (finalScore >= 82) action = "STRONG BUY";
    else if (finalScore >= 67) action = "BUY";
    else if (finalScore <= 37) action = "SELL";

    // ==========================
    // 5. ANALYSIS TEXT
    // ==========================
    const analysis = {
      technical:
        recommendation > 0.45
          ? "Struktur teknikal bullish kuat."
          : recommendation < -0.45
          ? "Tekanan teknikal bearish."
          : "Konsolidasi / netral.",
      rsi:
        rsi > 0 && rsi < 30
          ? "Oversold — potensi rebound tinggi."
          : rsi > 70
          ? "Overbought — risiko koreksi."
          : "RSI dalam kondisi normal.",
      momentum:
        dayChange > 2
          ? "Momentum intraday sangat positif."
          : dayChange > 0.5
          ? "Momentum intraday positif."
          : dayChange < -2
          ? "Momentum intraday negatif."
          : "Momentum sideways.",
      macd:
        macd > macdSignal && macdHist > 0
          ? "MACD bullish crossover."
          : macd < macdSignal && macdHist < 0
          ? "MACD bearish pressure."
          : "MACD netral / sideways.",
    };

    // ==========================
    // RESPONSE
    // ==========================
    const response: StockSignalResponse = {
      symbol,
      companyName,
      price: currentPrice,
      prevClose,
      dayChange: parseFloat(dayChange.toFixed(2)),
      volume,
      rsi: parseFloat(rsi.toFixed(2)),
      macd: parseFloat(macd.toFixed(4)),
      macdSignal: parseFloat(macdSignal.toFixed(4)),
      macdHist: parseFloat(macdHist.toFixed(4)),
      recommendation: parseFloat(recommendation.toFixed(2)),
      score: finalScore,
      action,
      analysis,
      source: "Lintang Predator AI v2.1 + Yahoo Finance + TradingView",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Signal Engine Error:", error?.message);

    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat mengambil data signal",
        action: "HOLD",
        score: 50,
      },
      { status: 500 }
    );
  }
}