"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Zap,
  BarChart,
  Scale,
  Newspaper,
  RefreshCw,
  Loader2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Gem,
  Flame,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function SignalSection() {
  const [signals, setSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FILTER STATE
  const [activeFilter, setActiveFilter] = useState("ALL");

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchIntelligence = async () => {
    setIsLoading(true);
    try {
      const scanRes = await axios.get("/api/scan");
      const allStocks = scanRes.data;

      const signalPromises = allStocks.map((stock: any) =>
        axios.get(`/api/signal?symbol=${stock.Kode}`).then((res) => ({
          ...res.data,
          name: stock["Nama Perusahaan"],
        })),
      );

      const results = await Promise.all(signalPromises);
      const sortedResults = results.sort((a, b) => b.score - a.score);
      setSignals(sortedResults);
      setCurrentPage(1);
    } catch (e) {
      console.error("Predator Engine Failure:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, []);

  // LOGIKA FILTERING
  const filteredSignals = useMemo(() => {
    if (activeFilter === "ALL") return signals;
    if (activeFilter === "MULTIBAGGER")
      return signals.filter((s) => s.score >= 92);
    if (activeFilter === "STRONG BUY")
      return signals.filter((s) => s.action === "STRONG BUY" && s.score < 92);
    if (activeFilter === "HOLD")
      return signals.filter((s) => s.action === "HOLD");
    if (activeFilter === "SELL")
      return signals.filter((s) => s.action === "SELL");
    return signals;
  }, [signals, activeFilter]);

  // LOGIKA PAGINATION (Berdasarkan hasil filter)
  const totalPages = Math.ceil(filteredSignals.length / itemsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSignals.slice(start, start + itemsPerPage);
  }, [filteredSignals, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Komponen Filter Button
  const FilterBtn = ({ id, label }: { id: string; label: string }) => (
    <button
      onClick={() => {
        setActiveFilter(id);
        setCurrentPage(1);
      }}
      className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${
        activeFilter === id
          ? "bg-green-500 text-black border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
          : "bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-600"
      }`}
    >
      {label}
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-14 h-14 text-green-500 animate-spin mb-4" />
        <h3 className="text-white font-black italic tracking-[0.4em] uppercase text-[10px] animate-pulse">
          Applying Predator Intelligence Filters...
        </h3>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-12 bg-green-500 rounded-full" />
            <span className="text-green-500 text-[10px] font-black uppercase tracking-[0.3em]">
              Market DNA: {filteredSignals.length} Matches
            </span>
          </div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
            Trade <span className="text-zinc-800">Intelligence</span>
          </h2>
        </div>
        <button
          onClick={fetchIntelligence}
          className="group flex items-center gap-3 px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-green-500/50 transition-all active:scale-95 shadow-xl"
        >
          <RefreshCw className="w-4 h-4 text-zinc-500 group-hover:text-green-500" />
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-12 p-2 bg-black/40 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
        <FilterBtn id="ALL" label="View All" />
        <FilterBtn id="MULTIBAGGER" label="💎 Multibagger" />
        <FilterBtn id="STRONG BUY" label="🚀 Strong Buy" />
        <FilterBtn id="HOLD" label="⏳ Hold" />
        <FilterBtn id="SELL" label="⚠️ Sell" />
      </div>

      {/* SIGNALS LIST */}
      <div className="grid gap-8">
        {currentData.length > 0 ? (
          currentData.map((sig, i) => {
            const isMultibagger = sig.score >= 92;
            const isSell = sig.action === "SELL";
            const isStrongBuy = sig.action === "STRONG BUY";

            return (
              <div
                key={i}
                className={`relative overflow-hidden bg-[#0b0b0c] border rounded-[45px] p-8 transition-all duration-500 ${
                  isMultibagger
                    ? "border-orange-500/50 shadow-[0_0_40px_rgba(249,115,22,0.1)]"
                    : isSell
                      ? "border-red-900/50"
                      : "border-zinc-800/50"
                }`}
              >
                {isMultibagger && (
                  <div className="absolute top-0 right-12 translate-y-[-50%] bg-orange-500 text-black px-6 py-2 rounded-full flex items-center gap-2 z-20">
                    <Gem className="w-4 h-4 fill-black" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      PREDATOR MULTIBAGGER
                    </span>
                  </div>
                )}

                <div className="flex flex-col xl:flex-row gap-10 items-center relative z-10">
                  {/* SCORE */}
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-zinc-900"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 - (364.4 * sig.score) / 100}
                        className={`transition-all duration-1000 ${isMultibagger ? "text-orange-500" : isSell ? "text-red-500" : "text-green-500"}`}
                      />
                    </svg>
                    <span
                      className={`absolute text-3xl font-black italic ${isMultibagger ? "text-orange-500" : "text-white"}`}
                    >
                      {sig.score}
                    </span>
                  </div>

                  {/* INFO */}
                  <div className="flex-1 text-center xl:text-left">
                    <div className="flex items-center justify-center xl:justify-start gap-4 mb-2">
                      <h3 className="text-3xl font-black text-white italic">
                        {sig.symbol}
                      </h3>
                      <div
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${
                          isMultibagger
                            ? "bg-orange-500 text-black"
                            : isSell
                              ? "bg-red-600 text-white animate-pulse"
                              : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {isMultibagger ? "GEM IDENTIFIED" : sig.action}
                      </div>
                    </div>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase">
                      {sig.name}
                    </p>
                  </div>

                  {/* ANALYSIS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full xl:w-[55%]">
                    <AnalysisBlock
                      icon={
                        <BarChart
                          className={
                            isMultibagger ? "text-orange-500" : "text-blue-500"
                          }
                        />
                      }
                      label="Technical"
                      text={sig.analysis.technical}
                    />
                    <AnalysisBlock
                      icon={
                        <Scale
                          className={
                            isMultibagger
                              ? "text-orange-500"
                              : "text-purple-500"
                          }
                        />
                      }
                      label="Fundamental"
                      text={sig.analysis.fundamental}
                    />
                    <AnalysisBlock
                      icon={
                        <Newspaper
                          className={
                            isMultibagger ? "text-orange-500" : "text-green-500"
                          }
                        />
                      }
                      label="Sentiment"
                      text={sig.analysis.sentiment}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center border border-dashed border-zinc-800 rounded-[45px]">
            <p className="text-zinc-600 font-black uppercase tracking-widest">
              No Signals Found for "{activeFilter}"
            </p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-16">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 disabled:opacity-20 hover:text-green-500 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-white font-black italic text-xl">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 disabled:opacity-20 hover:text-green-500 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

function AnalysisBlock({
  icon,
  label,
  text,
}: {
  icon: any;
  label: string;
  text: string;
}) {
  return (
    <div className="bg-zinc-950/50 border border-zinc-800/30 p-5 rounded-[30px]">
      <div className="flex items-center gap-2 mb-2">
        {React.cloneElement(icon, { size: 12 })}
        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-tighter">
          {label}
        </span>
      </div>
      <p className="text-[10px] text-zinc-400 leading-relaxed italic line-clamp-3">
        {text}
      </p>
    </div>
  );
}
