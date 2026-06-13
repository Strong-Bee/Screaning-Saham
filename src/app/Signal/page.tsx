"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Clock,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ================= TYPES ================= */
interface SignalItem {
  symbol: string;
  companyName?: string;
  score: number;
  action: "STRONG BUY" | "BUY" | "HOLD" | "SELL";
  dayChange: number;
  price?: number;
}

interface ScanItem {
  Kode: string;
}

/* ================= SIGNAL CARD ================= */
function SignalCard({ s }: { s: SignalItem }) {
  const isStrongBuy = s.action === "STRONG BUY";
  const isBuy = s.action === "BUY";
  const isSell = s.action === "SELL";

  const colorClass = isStrongBuy
    ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
    : isBuy
      ? "text-blue-400 border-blue-500/40 bg-blue-500/10"
      : isSell
        ? "text-red-400 border-red-500/40 bg-red-500/10"
        : "text-zinc-400 border-zinc-700 bg-zinc-800/40";

  const Icon =
    isStrongBuy || isBuy ? TrendingUp : isSell ? TrendingDown : Minus;

  return (
    <div className="group relative bg-[#0b0b0c] border border-zinc-800 hover:border-blue-500/30 rounded-3xl p-7 transition-all duration-300 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-black tracking-[-1.5px]">
              {s.symbol}
            </h3>
            {s.companyName && (
              <span className="text-[10px] text-zinc-500 font-medium mt-1.5 line-clamp-1">
                {s.companyName}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">Predator AI Score</p>
        </div>

        <div
          className={`px-3.5 py-1 rounded-2xl text-[10px] font-black tracking-wider border ${colorClass}`}
        >
          {s.action}
        </div>
      </div>

      {/* Body */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition">
          <Icon className="w-5 h-5" />
        </div>

        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm text-zinc-400">Change</span>
            <span
              className={`font-mono text-sm font-bold ${
                s.dayChange > 0
                  ? "text-emerald-400"
                  : s.dayChange < 0
                    ? "text-red-400"
                    : "text-zinc-400"
              }`}
            >
              {s.dayChange > 0 ? "+" : ""}
              {s.dayChange}%
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500">Score </span>
            <span className="font-mono text-xl font-black text-white">
              {s.score}
            </span>
          </div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
          style={{ width: `${s.score}%` }}
        />
      </div>

      {s.price && (
        <div className="mt-4 text-right">
          <span className="text-xs text-zinc-500">Price </span>
          <span className="font-mono text-sm font-medium text-white">
            Rp {s.price.toLocaleString("id-ID")}
          </span>
        </div>
      )}
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function SignalPage() {
  const [signals, setSignals] = useState<SignalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadSignals = useCallback(async () => {
    setLoading(true);

    try {
      // 1. Ambil daftar saham
      const scanRes = await fetch("/api/scan");
      if (!scanRes.ok) throw new Error("Gagal mengambil daftar saham");

      const scanData: ScanItem[] = await scanRes.json();

      if (!Array.isArray(scanData) || scanData.length === 0) {
        setSignals([]);
        return;
      }

      // Ambil maksimal 12 saham
      const symbolsToFetch = scanData.slice(0, 12);

      // 2. Fetch semua signal secara PARALEL (jauh lebih cepat)
      const promises = symbolsToFetch.map(async (item) => {
        try {
          const res = await fetch(`/api/signal?symbol=${item.Kode}`);
          if (!res.ok) throw new Error("Signal fetch failed");

          const data = await res.json();

          return {
            symbol: data.symbol || item.Kode,
            companyName: data.companyName,
            score: data.score ?? 50,
            action: data.action ?? "HOLD",
            dayChange: data.dayChange ?? 0,
            price: data.price,
          } as SignalItem;
        } catch {
          return {
            symbol: item.Kode,
            score: 50,
            action: "HOLD" as const,
            dayChange: 0,
          };
        }
      });

      const results = await Promise.all(promises);

      // Urutkan dari score tertinggi
      results.sort((a, b) => b.score - a.score);

      setSignals(results);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Gagal memuat signal:", error);
      setSignals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSignals();
  }, [loadSignals]);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar onSync={loadSignals} isLoading={loading} />

      {/* HERO */}
      <section className="relative pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10">
              <Zap className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <span className="text-[10px] font-black tracking-[3px] text-blue-500">
              PREDATOR ENGINE
            </span>
          </div>

          <h1 className="text-6xl font-black tracking-[-3.5px] leading-none">
            Signal <span className="text-blue-500">Engine</span>
          </h1>
          <p className="mt-4 max-w-md text-zinc-400 text-[15px]">
            Real-time AI signal untuk saham Indonesia berdasarkan momentum,
            teknikal, dan smart money flow.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pb-20">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-zinc-400">Top Signals</span>
            {lastUpdated && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock className="w-3.5 h-3.5" />
                Updated{" "}
                {lastUpdated.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>

          <button
            onClick={loadSignals}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-2xl border border-zinc-800 hover:bg-zinc-900 transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Signals Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[218px] rounded-3xl bg-zinc-900/40 border border-zinc-800 animate-pulse"
              />
            ))}
          </div>
        ) : signals.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {signals.map((signal) => (
              <SignalCard key={signal.symbol} s={signal} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-zinc-400 mb-2">Tidak ada data signal</div>
            <button
              onClick={loadSignals}
              className="text-sm text-blue-500 hover:underline"
            >
              Coba muat ulang
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] text-zinc-500 border border-zinc-800 rounded-2xl px-4 py-2">
            STRONG BUY = High Probability Entry &nbsp;•&nbsp; BUY = Momentum
            Building &nbsp;•&nbsp; HOLD = Wait &amp; See &nbsp;•&nbsp; SELL =
            Distribution Zone
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
