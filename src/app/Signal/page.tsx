"use client";

import React, { useEffect, useState } from "react";
import { Zap, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ================= TYPES ================= */
interface ScanItem {
  Kode: string;
}

interface SignalItem {
  symbol: string;
  score: number;
  action: "STRONG BUY" | "BUY" | "HOLD" | "SELL";
  dayChange: number;
}

/* ================= SIGNAL CARD ================= */
function SignalCard({ s }: { s: SignalItem }) {
  const color =
    s.action === "STRONG BUY"
      ? "text-green-500 border-green-500/30 bg-green-500/10"
      : s.action === "BUY"
        ? "text-blue-500 border-blue-500/30 bg-blue-500/10"
        : s.action === "SELL"
          ? "text-red-500 border-red-500/30 bg-red-500/10"
          : "text-zinc-400 border-zinc-700 bg-zinc-800/40";

  const Icon =
    s.action === "STRONG BUY" || s.action === "BUY"
      ? TrendingUp
      : s.action === "SELL"
        ? TrendingDown
        : Minus;

  return (
    <div className="relative bg-[#0b0b0c] border border-zinc-800 rounded-[32px] p-8 hover:border-blue-500/40 transition overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-3xl font-black tracking-tight">{s.symbol}</h3>
          <p className="text-sm text-zinc-500 mt-1">AI Signal Score</p>
        </div>

        <div
          className={`px-4 py-1.5 rounded-xl text-[11px] font-black border ${color}`}
        >
          {s.action}
        </div>
      </div>

      {/* BODY */}
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <Icon className="w-6 h-6" />
        </div>

        <div>
          <p className="text-base text-zinc-400">
            Change:{" "}
            <span
              className={
                s.dayChange > 0
                  ? "text-green-500"
                  : s.dayChange < 0
                    ? "text-red-500"
                    : "text-zinc-400"
              }
            >
              {s.dayChange}%
            </span>
          </p>

          <p className="text-sm text-zinc-500 mt-1">
            Score: <span className="text-white font-bold">{s.score}</span>
          </p>
        </div>
      </div>

      {/* SCORE BAR */}
      <div className="mt-8 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500" style={{ width: `${s.score}%` }} />
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function SignalPage() {
  const [signals, setSignals] = useState<SignalItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD SIGNALS ================= */
  const loadSignals = async () => {
    setLoading(true);

    try {
      // 1️⃣ ambil daftar saham dari scanner
      const scanRes = await fetch("/api/scan");
      const scanData: ScanItem[] = await scanRes.json();

      if (!Array.isArray(scanData)) {
        setSignals([]);
        setLoading(false);
        return;
      }

      // 2️⃣ ambil signal tiap saham
      const results: SignalItem[] = [];

      for (const s of scanData.slice(0, 12)) {
        try {
          const sigRes = await fetch(`/api/signal?symbol=${s.Kode}`);
          const sig = await sigRes.json();

          results.push({
            symbol: sig.symbol ?? s.Kode,
            score: sig.score ?? 50,
            action: sig.action ?? "HOLD",
            dayChange: sig.dayChange ?? 0,
          });
        } catch {
          results.push({
            symbol: s.Kode,
            score: 50,
            action: "HOLD",
            dayChange: 0,
          });
        }
      }

      // urutkan dari skor tertinggi
      results.sort((a, b) => b.score - a.score);

      setSignals(results);
    } catch (e) {
      console.error("Signal load error:", e);
      setSignals([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadSignals();
  }, []);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar onSync={loadSignals} isLoading={loading} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-30%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[140px] rounded-full" />
          <div className="absolute bottom-[-30%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-blue-500 w-5 h-5" />
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.35em]">
              Predator Engine
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
            Signal{" "}
            <span className="text-blue-500 underline decoration-blue-600 decoration-4 underline-offset-4 sm:underline-offset-8">
              Engine
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-zinc-400 text-sm sm:text-base leading-relaxed">
            AI trading signal berbasis momentum, probabilitas multibagger, dan
            analisis pergerakan smart money saham Indonesia.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[220px] bg-zinc-900/40 border border-zinc-800 rounded-[32px] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {signals.map((s) => (
              <SignalCard key={s.symbol} s={s} />
            ))}
          </div>
        )}

        {/* LEGEND */}
        <div className="mt-14 text-center text-xs text-zinc-500">
          STRONG BUY = Predator Entry Zone • BUY = Momentum Build • HOLD =
          Consolidation • SELL = Distribution
        </div>
      </main>

      <Footer />
    </div>
  );
}
