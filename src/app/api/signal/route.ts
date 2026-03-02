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

    const googleUrl = `https://www.google.com/finance/quote/${symbol}:${exchange}`;

    // ==========================
    // FETCH HTML (Native fetch)
    // ==========================
    const res = await fetch(googleUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Google fetch failed: ${res.status}`);
    }

    const html = await res.text();

    // ==========================
    // EXTRACT PRICE (Flexible)
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
    // SCORING ENGINE
    // ==========================
    let techScore = 50;

    if (dayChange > 4) techScore += 30;
    else if (dayChange > 2) techScore += 20;
    else if (dayChange > 0) techScore += 10;
    else if (dayChange < -3) techScore -= 25;
    else if (dayChange < -1) techScore -= 10;

    // Multibagger heuristic
    let multibaggerProb = 0;
    if (dayChange > 1 && dayChange < 6) multibaggerProb = 30;

    const finalScore = Math.min(
      Math.max(Math.round(techScore + multibaggerProb / 2), 0),
      100
    );

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
      score: finalScore,
      action,
      source: "Lintang Predator AI Engine v2",
      analysis: {
        technical:
          dayChange > 2
            ? "Momentum kuat terdeteksi."
            : dayChange < -2
            ? "Tekanan jual signifikan."
            : "Konsolidasi area support/resistance.",
        fundamental: "Data fundamental terbatas (scraping mode).",
        sentiment:
          dayChange > 0
            ? "Bullish intraday sentiment."
            : dayChange < 0
            ? "Bearish intraday sentiment."
            : "Neutral sentiment.",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Scraping Error:", error?.message);

    return NextResponse.json(
      {
        error: "Failed to fetch stock data",
        score: 50,
        action: "HOLD",
        analysis: {
          technical: "Scraper error",
          fundamental: "Unavailable",
          sentiment: "Neutral",
        },
      },
      { status: 500 }
    );
  }
}