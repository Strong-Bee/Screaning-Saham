import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) return NextResponse.json({ error: "Symbol is required" }, { status: 400 });

  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // LOGIKA VARIASI SKOR (Termasuk potensi skor rendah untuk SELL)
  const techScore = (seed % 60) + 30;  // Range 30 - 90
  const fundScore = ((seed * 1.2) % 50) + 40; // Range 40 - 90
  const sentScore = ((seed * 1.5) % 60) + 30; // Range 30 - 90

  const finalScore = Math.round((techScore * 0.4) + (fundScore * 0.3) + (sentScore * 0.3));

  // PENENTUAN AKSI TERMASUK SELL
  let action: "STRONG BUY" | "BUY" | "HOLD" | "SELL" = "HOLD";
  if (finalScore >= 85) action = "STRONG BUY";
  else if (finalScore >= 70) action = "BUY";
  else if (finalScore >= 50) action = "HOLD";
  else action = "SELL"; // Di bawah 50 langsung SELL

  return NextResponse.json({
    symbol: symbol.toUpperCase(),
    score: finalScore,
    action: action,
    analysis: {
      technical: finalScore < 50 
        ? "Bearish Trend: Harga menembus Support krusial dengan volume distribusi besar." 
        : (techScore > 80 ? "Bullish: Akumulasi kuat di area MA20." : "Netral: Harga sideway."),
      fundamental: finalScore < 50 
        ? "Peringatan: Terjadi penurunan margin laba bersih yang signifikan secara berturut-turut." 
        : (fundScore > 80 ? "Solid: ROE & Cash Flow sangat sehat." : "Stabil: Fundamental cukup terjaga."),
      sentiment: finalScore < 50 
        ? "Negatif: Adanya rumor negatif terkait tata kelola perusahaan atau prospek industri." 
        : (sentScore > 75 ? "Optimis: Sentimen positif mendominasi berita." : "Netral: Arus berita stabil.")
    }
  });
}