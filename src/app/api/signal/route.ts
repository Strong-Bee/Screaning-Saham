import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";

// ==========================
// FORCE REALTIME CONFIG
// ==========================
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs"; // penting karena pakai fs

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

// ==========================
// SUPER NO-CACHE HEADERS
// ==========================
const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
  "X-Accel-Expires": "0",
};

// ==========================
// ENHANCED FETCH WITH TIMEOUT
// ==========================
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 9000
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: "no-store",
      next: { revalidate: 0 },
      credentials: "omit",
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ==========================
// GET STOCK SIGNAL (REALTIME)
// ==========================
async function getStockSignal(symbol: string): Promise<StockSignalResponse> {
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

  // Cache buster yang lebih kuat
  const cacheBuster = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // 1. YAHOO FINANCE (Price Data) - dengan cache busting lebih agresif
  try {
    const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}.JK&crumb=${cacheBuster}&t=${cacheBuster}`;

    const yahooRes = await fetchWithTimeout(yahooUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
      },
    }, 8500);

    if (yahooRes.ok) {
      const yahooData = await yahooRes.json();
      const quote = yahooData?.quoteResponse?.result?.[0];

      if (quote && typeof quote.regularMarketPrice === "number") {
        currentPrice = quote.regularMarketPrice;
        dayChange = quote.regularMarketChangePercent ?? 0;
        prevClose = quote.regularMarketPreviousClose ?? 0;
        volume = quote.regularMarketVolume ?? 0;
        companyName = quote.shortName || quote.longName || symbol;
      }
    }
  } catch (e) {
    console.warn(`[Yahoo] ${symbol}:`, e instanceof Error ? e.message : e);
  }

  // 2. TRADINGVIEW SCANNER
  try {
    const tvRes = await fetchWithTimeout(
      "https://scanner.tradingview.com/indonesia/scan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
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
      },
      8500
    );

    if (tvRes.ok) {
      const tvData = await tvRes.json();
      const row = tvData?.data?.[0];

      if (row?.d && Array.isArray(row.d) && row.d.length >= 5) {
        const d = row.d;
        recommendation = Number(d[0]) || 0;
        rsi = Number(d[1]) || 0;
        macd = Number(d[2]) || 0;
        macdSignal = Number(d[3]) || 0;
        macdHist = Number(d[4]) || 0;
      }
    }
  } catch (e) {
    console.warn(`[TradingView] ${symbol}:`, e instanceof Error ? e.message : e);
  }

  // 3. LINTANG PREDATOR AI SCORING
  let score = 50;

  if (dayChange > 4) score += 20;
  else if (dayChange > 2) score += 13;
  else if (dayChange > 0.7) score += 6;
  else if (dayChange < -4) score -= 20;
  else if (dayChange < -2.5) score -= 13;
  else if (dayChange < -0.7) score -= 5;

  if (rsi > 0) {
    if (rsi < 30) score += 17;
    else if (rsi < 40) score += 8;
    else if (rsi > 70) score -= 12;
    else if (rsi > 62) score -= 6;
  }

  if (macd > 0 && macdHist > 0) score += 11;
  else if (macd < 0 && macdHist < 0) score -= 7;

  if (macd > macdSignal) score += 7;
  else if (macd < macdSignal) score -= 5;

  score += recommendation * 17;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  let action: "STRONG BUY" | "BUY" | "HOLD" | "SELL" = "HOLD";
  if (finalScore >= 82) action = "STRONG BUY";
  else if (finalScore >= 67) action = "BUY";
  else if (finalScore <= 37) action = "SELL";

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

  return {
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
    source: "Lintang Predator AI v2.2 + Yahoo Finance + TradingView",
    timestamp: new Date().toISOString(),
  };
}

// ==========================
// ROUTE HANDLER
// ==========================
export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const symbolParam = searchParams.get("symbol");
    const symbolsParam = searchParams.get("symbols");

    let symbolsToProcess: string[] = [];
    let isSingleSymbolRequest = false;

    if (symbolParam) {
      const cleanSymbol = symbolParam.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (!cleanSymbol || cleanSymbol.length < 2 || cleanSymbol.length > 5) {
        return NextResponse.json({ error: "Symbol tidak valid." }, { status: 400, headers: NO_CACHE_HEADERS });
      }
      symbolsToProcess = [cleanSymbol];
      isSingleSymbolRequest = true;
    } 
    else if (symbolsParam) {
      const rawSymbols = symbolsParam.split(",").map(s => s.trim()).filter(Boolean);
      symbolsToProcess = rawSymbols
        .map(s => s.toUpperCase().replace(/[^A-Z0-9]/g, ""))
        .filter(s => s.length >= 2 && s.length <= 5);

      if (symbolsToProcess.length === 0) {
        return NextResponse.json({ error: "Parameter symbols kosong atau tidak valid." }, { status: 400, headers: NO_CACHE_HEADERS });
      }
      isSingleSymbolRequest = symbolsToProcess.length === 1;
    } 
    else {
      try {
        const filePath = path.join(process.cwd(), "public", "saham_target.json");
        if (existsSync(filePath)) {
          const json = JSON.parse(readFileSync(filePath, "utf-8"));
          if (Array.isArray(json)) {
            symbolsToProcess = json
              .map((s: unknown) => String(s).trim().toUpperCase().replace(/[^A-Z0-9]/g, ""))
              .filter(s => s.length >= 2 && s.length <= 5);
          }
        }
      } catch (e) {
        console.error("Gagal membaca saham_target.json:", e);
      }

      if (symbolsToProcess.length === 0) {
        return NextResponse.json({ error: "Tidak ada simbol yang bisa diproses." }, { status: 400, headers: NO_CACHE_HEADERS });
      }
    }

    // Proses paralel (maks 8 untuk kestabilan realtime)
    const MAX_PARALLEL = 8;
    const results: StockSignalResponse[] = [];

    for (let i = 0; i < symbolsToProcess.length; i += MAX_PARALLEL) {
      const batch = symbolsToProcess.slice(i, i + MAX_PARALLEL);
      const batchResults = await Promise.all(batch.map(getStockSignal));
      results.push(...batchResults);
    }

    const responseTime = Date.now() - startTime;
    console.log(`[Signal] Processed ${results.length} symbols in ${responseTime}ms`);

    if (results.length === 1 && isSingleSymbolRequest) {
      return NextResponse.json(results[0], { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json(results, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Signal Engine Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}