"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";

interface SahamData {
  kode: string;
  nama: string;
  price: number;
  rsi: number;
  signal: "BUY" | "SELL" | "HOLD";
}

export default function LintangPredatorDashboard() {
  const [sahamList, setSahamList] = useState<SahamData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("-");

  const executeRadar = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/scan");
      if (Array.isArray(response.data)) {
        setSahamList(response.data);
      }
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Radar Error:", error);
      alert("Gagal Terhubung ke Radar. Periksa koneksi atau API route.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-green-500 selection:text-black">
      {/* HEADER NAVIGATION - Responsive Padding & Layout */}
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded flex items-center justify-center shadow-[0_0_10px_rgba(22,163,74,0.5)]">
              <ShieldAlert className="text-black w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-xl font-black tracking-tighter uppercase whitespace-nowrap">
              Lintang-GPT{" "}
              <span className="text-green-500 hidden sm:inline">Predator</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden lg:block text-right">
              <p className="text-[10px] text-zinc-500 uppercase leading-none">
                Status Sistem
              </p>
              <p className="text-xs font-mono text-green-500">BEI - Live</p>
            </div>
            <button
              onClick={executeRadar}
              disabled={isLoading}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                isLoading
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-green-600 text-black hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              }`}
            >
              <RefreshCw
                className={`w-3 h-3 sm:w-4 sm:h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "SCANNING..." : "EXECUTE"}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* STATS SUMMARY - Responsive Grid (1 col on mobile, 3 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
            <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1 tracking-widest">
              Total Scan
            </p>
            <p className="text-xl sm:text-2xl font-mono">
              {sahamList.length}{" "}
              <span className="text-xs text-zinc-600">Emiten</span>
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl border-l-green-600 border-l-4">
            <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1 tracking-widest text-green-500">
              Buy Signals
            </p>
            <p className="text-xl sm:text-2xl font-mono text-green-500">
              {sahamList.filter((s) => s.signal === "BUY").length}
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl sm:col-span-2 lg:col-span-1">
            <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1 tracking-widest">
              Waktu Update
            </p>
            <p className="text-xl sm:text-2xl font-mono text-blue-400">
              {lastUpdate}
            </p>
          </div>
        </div>

        {/* DATA GRID - Adaptive Columns */}
        {sahamList.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20 px-4 text-center">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-800 mb-4" />
            <p className="text-zinc-600 uppercase tracking-widest text-[10px] sm:text-xs font-bold max-w-xs">
              Radar Siap. Tekan tombol diatas untuk berburu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sahamList.map((saham) => (
              <div
                key={saham.kode}
                className="group bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl hover:border-green-600/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <div className="overflow-hidden">
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-green-400 transition-colors">
                      {saham.kode}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase truncate pr-2 font-medium">
                      {saham.nama}
                    </p>
                  </div>
                  <div
                    className={`px-2 sm:px-3 py-1 rounded-md text-[9px] sm:text-[10px] font-black border flex-shrink-0 ${
                      saham.signal === "BUY"
                        ? "bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                        : saham.signal === "SELL"
                          ? "bg-red-500/10 border-red-500 text-red-500"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {saham.signal}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 font-mono">
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-zinc-500 text-[9px] sm:text-[10px] uppercase">
                      Price
                    </span>
                    <span className="text-base sm:text-lg font-bold text-zinc-100 whitespace-nowrap">
                      Rp {saham.price?.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-zinc-500 text-[9px] sm:text-[10px] uppercase">
                      RSI (14)
                    </span>
                    <span
                      className={`font-bold text-sm sm:text-base ${
                        saham.rsi > 70
                          ? "text-red-400"
                          : saham.rsi < 35
                            ? "text-green-400"
                            : "text-zinc-300"
                      }`}
                    >
                      {saham.rsi}
                    </span>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6">
                  {saham.signal === "BUY" && (
                    <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] text-green-500 font-black bg-green-500/5 w-full p-2 rounded border border-green-500/20 animate-pulse">
                      <TrendingUp className="w-3 h-3" /> AKUMULASI
                    </div>
                  )}
                  {saham.signal === "SELL" && (
                    <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] text-red-500 font-black bg-red-500/5 w-full p-2 rounded border border-red-500/20">
                      <TrendingDown className="w-3 h-3" /> DISTRIBUSI
                    </div>
                  )}
                  {saham.signal === "HOLD" && (
                    <div className="text-[9px] sm:text-[10px] text-zinc-600 font-bold bg-zinc-800/20 w-full p-2 rounded border border-zinc-800/50 text-center">
                      WAITING
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-10 sm:mt-20 border-t border-zinc-900 p-6 sm:p-10 text-center px-4">
        <p className="text-zinc-700 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.5em] mb-2 font-bold">
          Lintang Predator System &copy; 2026
        </p>
      </footer>
    </div>
  );
}
