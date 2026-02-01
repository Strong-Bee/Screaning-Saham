"use client";

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  ShieldAlert,
  BarChart3,
  ExternalLink,
  Activity,
  Zap,
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
  const [filterSignal, setFilterSignal] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const executeRadar = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await axios.get("/api/scan");
      if (Array.isArray(response.data)) {
        setSahamList(response.data);
      }
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Radar Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efek untuk Auto Refresh
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => executeRadar(true), 60000); // Tiap 60 detik
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter gabungan: Signal + Search
  const filteredSaham = useMemo(() => {
    return sahamList.filter((s) => {
      const matchesSignal = filterSignal === "ALL" || s.signal === filterSignal;
      const matchesSearch = s.kode
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSignal && matchesSearch;
    });
  }, [sahamList, filterSignal, searchTerm]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] font-sans selection:bg-green-500 selection:text-black">
      {/* NAVBAR */}
      <nav className="border-b border-zinc-800 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(22,163,74,0.4)]">
              <ShieldAlert className="text-black w-6 h-6" />
            </div>
            <div className="hidden md:block">
              <span className="text-xl font-black tracking-tighter uppercase block leading-none">
                LINTANG{" "}
                <span className="text-green-500 font-outline-1">PREDATOR</span>
              </span>
              <span className="text-[9px] text-zinc-500 font-bold tracking-[0.2em] uppercase italic">
                Automated Market Hunter
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 gap-2">
              <div
                className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-green-500 animate-pulse" : "bg-zinc-600"}`}
              ></div>
              <span className="text-[10px] font-bold text-zinc-400">LIVE</span>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={() => setAutoRefresh(!autoRefresh)}
                className="w-3 h-3 accent-green-500 cursor-pointer"
              />
            </div>

            <button
              onClick={() => executeRadar()}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                isLoading
                  ? "bg-zinc-800 text-zinc-500"
                  : "bg-white text-black hover:bg-green-500 shadow-lg"
              }`}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline uppercase">Execute Radar</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* STATS SUMMARY */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="group bg-zinc-900/30 border border-zinc-800 p-5 rounded-3xl hover:bg-zinc-900/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest text-left">
                Monitoring
              </p>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-mono font-bold text-left">
              {sahamList.length}
            </p>
          </div>

          <div className="group bg-zinc-900/30 border border-zinc-800 p-5 rounded-3xl border-l-green-600 border-l-4 hover:bg-zinc-900/50 transition-all">
            <div className="flex justify-between items-start mb-2">
              <p className="text-green-500 text-[10px] uppercase font-black tracking-widest text-left">
                Buy Zone
              </p>
              <Zap className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-3xl font-mono font-bold text-green-500 text-left">
              {sahamList.filter((s) => s.signal === "BUY").length}
            </p>
          </div>

          <div className="group bg-zinc-900/30 border border-zinc-800 p-5 rounded-3xl border-l-red-600 border-l-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-red-500 text-[10px] uppercase font-black tracking-widest text-left">
                Sell Zone
              </p>
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-3xl font-mono font-bold text-red-500 text-left">
              {sahamList.filter((s) => s.signal === "SELL").length}
            </p>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 p-5 rounded-3xl flex flex-col justify-center">
            <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest text-left mb-1">
              Last Update
            </p>
            <p className="text-xl font-mono font-bold text-blue-400">
              {lastUpdate}
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER AREA */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 w-full md:w-fit">
            {["ALL", "BUY", "SELL", "HOLD"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterSignal(type)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                  filterSignal === type
                    ? "bg-zinc-800 text-white shadow-xl"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search Kode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-green-600 outline-none transition-all font-bold uppercase"
            />
          </div>
        </div>

        {/* DATA GRID */}
        {filteredSaham.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-zinc-900 rounded-[40px] bg-zinc-950/50">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-zinc-600 uppercase tracking-[0.3em] text-[10px] font-black">
              Target Not Found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filteredSaham.map((saham) => (
              <div
                key={saham.kode}
                className="group relative bg-[#0d0d0e] border border-zinc-800 p-6 rounded-[32px] hover:border-zinc-500 hover:translate-y-[-4px] transition-all duration-500 overflow-hidden"
              >
                {/* Visual Background Signal */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -z-10 opacity-20 ${
                    saham.signal === "BUY"
                      ? "bg-green-600"
                      : saham.signal === "SELL"
                        ? "bg-red-600"
                        : "bg-zinc-600"
                  }`}
                />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-black text-white tracking-tighter italic">
                        {saham.kode}
                      </h3>
                      <a
                        href={`https://id.tradingview.com/chart/?symbol=IDX%3A${saham.kode}`}
                        target="_blank"
                        className="text-zinc-600 hover:text-blue-500 transition-colors"
                      >
                        <ExternalLink className="w-3.3 h-3.3" />
                      </a>
                    </div>
                    <p className="text-[9px] text-zinc-500 uppercase font-black truncate max-w-[140px] tracking-tight">
                      {saham.nama}
                    </p>
                  </div>

                  <div
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black border tracking-widest flex items-center gap-2 ${
                      saham.signal === "BUY"
                        ? "bg-green-500 text-black border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                        : saham.signal === "SELL"
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {saham.signal}
                  </div>
                </div>

                <div className="space-y-4 font-mono">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">
                      Last Price
                    </span>
                    <span className="text-lg font-bold">
                      Rp {saham.price.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* RSI PROGRESS BAR */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span className="text-zinc-500">RSI Intensity</span>
                      <span
                        className={
                          saham.rsi < 35
                            ? "text-green-500"
                            : saham.rsi > 70
                              ? "text-red-500"
                              : "text-blue-400"
                        }
                      >
                        {saham.rsi}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          saham.rsi < 35
                            ? "bg-green-500 shadow-[0_0_10px_#22c55e]"
                            : saham.rsi > 70
                              ? "bg-red-500 shadow-[0_0_10px_#ef4444]"
                              : "bg-blue-600"
                        }`}
                        style={{ width: `${saham.rsi}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-10 border-t border-zinc-900 mt-10">
        <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.5em]">
          Predator Engine v2.0 • Data via Yahoo Finance
        </p>
      </footer>
    </div>
  );
}
