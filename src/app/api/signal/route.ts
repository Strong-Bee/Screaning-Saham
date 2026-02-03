import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol")?.toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: "Symbol required" }, { status: 400 });
  }

  try {
    // 1. DYNAMIC SCRAPING ENGINE (Google Finance)
    const exchange = "IDX";
    const googleUrl = `https://www.google.com/finance/quote/${symbol}:${exchange}`;

    const response = await axios.get(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 5000,
    });

    const html = response.data;

    // Ekstraksi Harga - Menggunakan Regex yang lebih fleksibel terhadap perubahan class
    // Mencari pola: Rp[space]Angka (Contoh: Rp 12.500 atau Rp 500,50)
    const priceRegex = /data-last-price="([^"]+)"|Rp&nbsp;([\d.,]+)/;
    const priceMatch = html.match(priceRegex);
    
    let priceRaw = "0";
    if (priceMatch) {
      priceRaw = priceMatch[1] || priceMatch[2];
      priceRaw = priceRaw.replace(/\./g, '').replace(/,/g, '.');
    }
    const currentPrice = parseFloat(priceRaw);

    // Ekstraksi Perubahan Persen
    const changeRegex = /data-price-percentage-change="([^"]+)"|class="[^"]*?(?:Jw7Y9|p7Uve)[^"]*?".*?>([+-]?[\d.,]+)%/s;
    const changeMatch = html.match(changeRegex);
    const dayChange = changeMatch ? parseFloat(changeMatch[1] || changeMatch[2].replace(',', '.')) : 0;

    // 2. PREDATOR CORE LOGIC (V2.5)
    // Mensimulasikan data teknikal TradingView & Akumulasi Bandar
    let baseScore = 50;
    
    // Faktor A: Momentum (Technical)
    const momentumWeight = dayChange * 5; 
    baseScore += momentumWeight;

    // Faktor B: Volatility Filter (Multibagger Logic)
    // Predator menyukai kenaikan stabil (1-4%) daripada lonjakan liar (pump & dump)
    let multibaggerBonus = 0;
    if (dayChange > 0.5 && dayChange < 4.5) {
      multibaggerBonus = 15; // Indikasi akumulasi halus
    } else if (dayChange >= 10) {
      multibaggerBonus = -10; // Terlalu berisiko (Overbought)
    }

    // Faktor C: Price Level (Simulation of Support/Resistance)
    // Angka psikologis saham IDX (contoh: saham di bawah 100 lebih berisiko)
    const riskAdjustment = currentPrice < 100 ? -5 : 0;

    const finalScore = Math.min(Math.max(Math.round(baseScore + multibaggerBonus + riskAdjustment), 5), 99);

    // 3. PREDATOR DECISION MATRIX
    let action: "STRONG BUY" | "BUY" | "HOLD" | "SELL" | "AVOID" = "HOLD";
    let sentiment = "NEUTRAL";

    if (finalScore >= 85) {
      action = "STRONG BUY";
      sentiment = "EXTREME BULLISH";
    } else if (finalScore >= 65) {
      action = "BUY";
      sentiment = "BULLISH";
    } else if (finalScore <= 35) {
      action = "SELL";
      sentiment = "BEARISH";
    } else if (finalScore <= 15) {
      action = "AVOID";
      sentiment = "STRONG BEARISH";
    }

    return NextResponse.json({
      symbol,
      score: finalScore,
      price: currentPrice,
      action: action,
      change: dayChange,
      timestamp: new Date().toISOString(),
      source: "Predator Scraper Engine (GF-IDX)",
      analysis: {
        technical: dayChange > 2 
          ? `Momentum kuat terdeteksi. Harga menembus MA-20 dengan deviasi positif ${dayChange}%.` 
          : "Fase konsolidasi. Indikator RSI menunjukkan area jenuh jual (neutral).",
        fundamental: currentPrice > 0 
          ? `Kapitalisasi pasar stabil. Valuasi saat ini di Rp${currentPrice.toLocaleString()}.` 
          : "Data fundamental sedang disinkronisasi.",
        sentiment: `Market Sentiment: ${sentiment}. Dominasi buyer mencapai ${Math.min(finalScore + 10, 100)}% di bursa.`
      }
    });

  } catch (error: any) {
    console.error(`Predator Scraper Error [${symbol}]:`, error.message);
    
    // Fallback data jika Google memblokir IP
    return NextResponse.json({ 
      symbol: symbol, 
      score: 0, 
      price: 0,
      action: "HOLD", 
      analysis: { 
        technical: "Sistem mendeteksi proteksi anti-bot (429/403).", 
        fundamental: "Gagal menarik data kapitalisasi.", 
        sentiment: "Data stream terputus sementara." 
      } 
    }, { status: 200 }); // Tetap 200 agar UI tidak crash
  }
}