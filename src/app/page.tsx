"use client";

import React, { useState, useMemo } from "react";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  ShieldAlert,
  Filter,
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
      alert("Gagal Terhubung ke Radar.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logika Filter Dinamis
  const filteredSaham = useMemo(() => {
    if (filterSignal === "ALL") return sahamList;
    return sahamList.filter((s) => s.signal === filterSignal);
  }, [sahamList, filterSignal]);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-green-500 selection:text-black">
      {/* NAV ... (Tetap seperti sebelumnya) */}
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center shadow-[0_0_10px_rgba(22,163,74,0.5)]">
              <ShieldAlert className="text-black w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">
              Lintang-GPT <span className="text-green-500">Predator</span>
            </span>
          </div>

          <button
            onClick={executeRadar}
            disabled={isLoading}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95 ${
              isLoading
                ? "bg-zinc-800 text-zinc-500"
                : "bg-green-600 text-black hover:bg-green-400"
            }`}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "SCANNING..." : "EXECUTE"}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* STATS SUMMARY ... (Tetap seperti sebelumnya) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
            <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1 tracking-widest">
              Total Scan
            </p>
            <p className="text-2xl font-mono">{sahamList.length}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl border-l-green-600 border-l-4">
            <p className="text-green-500 text-[10px] uppercase font-bold mb-1 tracking-widest">
              Buy Signals
            </p>
            <p className="text-2xl font-mono text-green-500">
              {sahamList.filter((s) => s.signal === "BUY").length}
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
            <p className="text-zinc-500 text-[10px] uppercase font-bold mb-1 tracking-widest">
              Update
            </p>
            <p className="text-2xl font-mono text-blue-400">{lastUpdate}</p>
          </div>
        </div>

        {/* NEW: FILTER TABS */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-zinc-950 p-1 rounded-lg border border-zinc-800 w-fit">
          {["ALL", "BUY", "SELL", "HOLD"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterSignal(type)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-black tracking-widest transition-all ${
                filterSignal === type
                  ? "bg-zinc-800 text-white shadow-inner"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* DATA GRID */}
        {filteredSaham.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <Search className="w-12 h-12 text-zinc-800 mb-4" />
            <p className="text-zinc-600 uppercase tracking-widest text-xs font-bold">
              {sahamList.length > 0
                ? `Tidak ada saham dengan status ${filterSignal}`
                : "Radar Siap. Klik Execute."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSaham.map((saham) => (
              <div
                key={saham.kode}
                className="group bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-green-600/50 transition-all duration-300"
              >
                {/* Bagian Card Saham Tuan (Tetap sama seperti kode responsive sebelumnya) */}
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-black text-white">
                    {saham.kode}
                  </h3>
                  <div
                    className={`px-2 py-1 rounded text-[10px] font-black border ${
                      saham.signal === "BUY"
                        ? "border-green-500 text-green-500"
                        : saham.signal === "SELL"
                          ? "border-red-500 text-red-500"
                          : "border-zinc-700 text-zinc-500"
                    }`}
                  >
                    {saham.signal}
                  </div>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Price</span>{" "}
                    <span className="text-white">
                      Rp {saham.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>RSI</span>{" "}
                    <span className={saham.rsi < 35 ? "text-green-500" : ""}>
                      {saham.rsi}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
