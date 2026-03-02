import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolParam = searchParams.get("symbol");

    if (!symbolParam) {
      return NextResponse.json(
        { error: "Symbol required" },
        { status: 400 }
      );
    }

    // ==========================
    // SANITIZE SYMBOL
    // ==========================
    const symbol = symbolParam.toUpperCase().replace(/[^A-Z]/g, "");
    const exchange = "IDX";

    // ==========================
    // GOOGLE FINANCE FETCH
    // ==========================
    const googleUrl = `https://www.google.com/finance/quote/${symbol}:${exchange}`;

    const googleRes = await fetch(googleUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });

    if (!googleRes.ok) {
      throw new Error("Google fetch failed");
    }

    const html = await googleRes.text();

    // ==========================
    // EXTRACT PRICE
    // ==========================
    let currentPrice = 0;

    const priceMatch =
      html.match(/YMlKec fxKbKc[^>]*>(?:Rp)?\s?([\d.,]+)/) ||
      html.match(/data-last-price="([\d.]+)"/);

    if (priceMatch?.[1]) {
      const clean = priceMatch[1]
        .replace(/\./g, "")
        .replace(",", ".");
      currentPrice = parseFloat(clean);
    }

    // ==========================
    // EXTRACT CHANGE %
    // ==========================
    let dayChange = 0;
    const percentMatch = html.match(/data-percentage-change="(-?[\d.]+)"/);

    if (percentMatch?.[1]) {
      dayChange = parseFloat(percentMatch[1]);
    }

    // ==========================
    // TRADINGVIEW SIGNAL FETCH
    // ==========================
    let rsi = 0;
    let macd = 0;
    let recommendation = 0;

    try {
      const tvRes = await fetch(
        "https://scanner.tradingview.com/indonesia/scan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbols: {
              tickers: [`IDX:${symbol}`],
              query: { types: [] },
            },
            columns: [
              "Recommend.All",
              "RSI",
              "MACD.macd",
            ],
          }),
          cache: "no-store",
        }
      );

      const tvData = await tvRes.json();

      if (tvData?.data?.[0]?.d) {
        recommendation = tvData.data[0].d[0];
        rsi = tvData.data[0].d[1];
        macd = tvData.data[0].d[2];
      }
    } catch (e) {
      console.warn("TradingView fetch failed");
    }

    // ==========================
    // AI SCORING ENGINE
    // ==========================
    let score = 50;

    // momentum
    if (dayChange > 4) score += 25;
    else if (dayChange > 2) score += 15;
    else if (dayChange < -3) score -= 25;

    // RSI logic
    if (rsi < 30) score += 20;
    else if (rsi > 70) score -= 15;

    // MACD bullish
    if (macd > 0) score += 10;
    else score -= 5;

    // TradingView recommendation
    score += recommendation * 20;

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    // ==========================
    // DECISION
    // ==========================
    let action: "STRONG BUY" | "BUY" | "HOLD" | "SELL" = "HOLD";

    if (finalScore >= 85) action = "STRONG BUY";
    else if (finalScore >= 70) action = "BUY";
    else if (finalScore <= 40) action = "SELL";

    return NextResponse.json({
      symbol,
      price: currentPrice,
      dayChange,
      rsi,
      macd,
      recommendation,
      score: finalScore,
      action,
      source: "Lintang Predator AI + TradingView Engine",
      analysis: {
        technical:
          recommendation > 0.5
            ? "Strong bullish technical structure."
            : recommendation < -0.5
            ? "Bearish technical pressure."
            : "Neutral consolidation.",
        rsi:
          rsi < 30
            ? "Oversold zone."
            : rsi > 70
            ? "Overbought zone."
            : "Normal range.",
        momentum:
          dayChange > 0
            ? "Positive intraday momentum."
            : "Negative intraday momentum.",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Signal Engine Error:", error?.message);

    return NextResponse.json(
      {
        error: "Failed to fetch signal",
        action: "HOLD",
        score: 50,
      },
      { status: 500 }
    );
  }
}