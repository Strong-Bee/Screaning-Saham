"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Search,
  ShieldAlert,
  BarChart3,
} from "lucide-react";

// Interface untuk Tipe Data Saham agar tidak error di Vercel
interface SahamData {
  kode: string;
  nama: string;
  price: number;
  rsi: number;
  signal: "BUY" | "SELL" | "HOLD";
  color: string;
}

export default function LintangPredatorDashboard() {
  const [sahamList, setSahamList] = useState<SahamData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("-");

  // Fungsi Eksekusi Radar Lintang-GPT
  const executeRadar = async () => {
    setIsLoading(true);
    try {
      // Memanggil API Python di /api/index.py
      const response = await axios.get("/api/scan");
      setSahamList(response.data);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Radar Error:", error);
      alert("Koneksi ke API Python Terputus atau 404!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-green-500 selection:text-black">
      {/* HEADER NAVIGATION */}
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <ShieldAlert className="text-black w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">
              Lintang-GPT <span className="text-green-500">Predator</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-[10px] text-zinc-500 uppercase leading-none">
                Status Sistem
              </p>
              <p className="text-xs font-mono text-green-500">
                Bursa Efek Indonesia - Online
              </p>
            </div>
            <button
              onClick={executeRadar}
              disabled={isLoading}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold transition-all ${
                isLoading
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-green-600 text-black hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
              }`}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "SCANNING..." : "EXECUTE RADAR"}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
            <p className="text-zinc-500 text-xs uppercase font-bold mb-1">
              Total Scan
            </p>
            <p className="text-2xl font-mono">
              {sahamList.length}{" "}
              <span className="text-sm text-zinc-600">Emiten</span>
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
            <p className="text-zinc-500 text-xs uppercase font-bold mb-1">
              Buy Signals
            </p>
            <p className="text-2xl font-mono text-green-500">
              {sahamList.filter((s) => s.signal === "BUY").length}
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
            <p className="text-zinc-500 text-xs uppercase font-bold mb-1">
              Last Update
            </p>
            <p className="text-2xl font-mono text-blue-400">{lastUpdate}</p>
          </div>
        </div>

        {/* DATA GRID */}
        {sahamList.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl">
            <Search className="w-12 h-12 text-zinc-700 mb-4" />
            <p className="text-zinc-500 uppercase tracking-widest text-sm">
              Belum Ada Data. Tekan Execute Radar untuk berburu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sahamList.map((saham) => (
              <div
                key={saham.kode}
                className="group bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-green-600/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white group-hover:text-green-400 transition-colors">
                      {saham.kode}
                    </h3>
                    <p className="text-[10px] text-zinc-500 uppercase truncate w-48">
                      {saham.nama}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-md text-[10px] font-black border ${
                      saham.signal === "BUY"
                        ? "bg-green-500/10 border-green-500 text-green-500"
                        : saham.signal === "SELL"
                          ? "bg-red-500/10 border-red-500 text-red-500"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {saham.signal}
                  </div>
                </div>

                <div className="space-y-3 font-mono">
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-zinc-500 text-xs uppercase italic">
                      Last Price
                    </span>
                    <span className="text-lg font-bold">
                      Rp {saham.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                    <span className="text-zinc-500 text-xs uppercase italic">
                      RSI Intensity
                    </span>
                    <span
                      className={
                        saham.rsi > 70
                          ? "text-red-400"
                          : saham.rsi < 30
                            ? "text-green-400"
                            : "text-zinc-300"
                      }
                    >
                      {saham.rsi}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  {saham.signal === "BUY" && (
                    <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold bg-green-500/5 w-full p-2 rounded border border-green-500/20">
                      <TrendingUp className="w-3 h-3" /> AKUMULASI BANDAR
                      TERDETEKSI
                    </div>
                  )}
                  {saham.signal === "SELL" && (
                    <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-red-500/5 w-full p-2 rounded border border-red-500/20">
                      <TrendingDown className="w-3 h-3" /> DISTRIBUSI/JENUH BELI
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-zinc-900 p-8 text-center text-zinc-700 text-[10px] uppercase tracking-[0.2em]">
        Lintang Predator System &copy; 2026 - High Frequency Detection
      </footer>
    </div>
  );
}
