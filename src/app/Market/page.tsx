"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import {
  RefreshCw,
  Search,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ================= TYPES ================= */
interface StockItem {
  Kode: string;
  "Nama Perusahaan": string;
}

interface StockSignal {
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

/* ================= MINI CHART ================= */
const TradingViewWidget = ({ symbol }: { symbol: string }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: `IDX:${symbol}`,
      width: "100%",
      height: "160",
      locale: "id",
      dateRange: "12M",
      colorTheme: "dark",
      isTransparent: true,
      autosize: true,
    });

    container.current.innerHTML = "";
    container.current.appendChild(script);

    return () => {
      if (container.current) container.current.innerHTML = "";
    };
  }, [symbol]);

  return (
    <div
      ref={container}
      className="w-full h-[160px] rounded-2xl overflow-hidden bg-black/50 border border-zinc-800"
    />
  );
};

/* ================= ADVANCED CHART MODAL ================= */
const AdvancedChartModal = ({
  symbol,
  onClose,
}: {
  symbol: string;
  onClose: () => void;
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `IDX:${symbol}`,
      interval: "D",
      timezone: "Asia/Jakarta",
      theme: "dark",
      style: "1",
      locale: "id",
    });

    container.current.innerHTML = "";
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div className="w-full max-w-7xl h-[90vh] bg-[#050505] border border-zinc-800 rounded-3xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="font-black text-xl tracking-tight">{symbol}</h2>
            <p className="text-xs text-zinc-500">Advanced Technical Analysis</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition"
          >
            <X size={20} />
          </button>
        </div>
        <div ref={container} className="flex-1" />
      </div>
    </div>
  );
};

/* ================= STOCK CARD (DATA LENGKAP) ================= */
const StockCard = ({
  s,
  onMaximize,
}: {
  s: StockItem;
  onMaximize: (symbol: string) => void;
}) => {
  const [signal, setSignal] = useState<StockSignal | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSignal = async () => {
    setLoading(true);
    try {
      const res = await axios.get<StockSignal>(`/api/signal?symbol=${s.Kode}`);
      setSignal(res.data);
    } catch (e) {
      console.error("Gagal fetch signal:", e);
      setSignal(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignal();
  }, [s.Kode]);

  const getActionColor = (action: string) => {
    switch (action) {
      case "STRONG BUY":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "BUY":
        return "bg-emerald-400/10 text-emerald-400 border-emerald-400/30";
      case "HOLD":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "SELL":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-emerald-400";
    if (change < 0) return "text-red-400";
    return "text-zinc-400";
  };

  return (
    <div className="bg-[#0a0a0b] border border-zinc-800 rounded-3xl p-5 flex flex-col gap-4 hover:border-blue-500/30 transition-all group">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black tracking-tighter">{s.Kode}</h3>
            {signal && (
              <span
                className={`px-3 py-0.5 text-[10px] font-bold rounded-full border ${getActionColor(signal.action)}`}
              >
                {signal.action}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
            {s["Nama Perusahaan"]}
          </p>
        </div>

        <button
          onClick={() => onMaximize(s.Kode)}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 hover:text-blue-400 transition opacity-70 group-hover:opacity-100"
        >
          <Maximize2 size={17} />
        </button>
      </div>

      {/* Mini Chart */}
      <TradingViewWidget symbol={s.Kode} />

      {/* PRICE & SCORE */}
      {loading ? (
        <div className="h-[92px] flex items-center justify-center">
          <RefreshCw className="animate-spin text-blue-500" size={22} />
        </div>
      ) : signal ? (
        <div className="space-y-4">
          {/* Price Info */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-zinc-500">Harga Terkini</div>
              <div className="text-3xl font-black tabular-nums tracking-tighter">
                {signal.price.toLocaleString("id-ID")}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`flex items-center justify-end gap-1 text-sm font-bold ${getChangeColor(signal.dayChange)}`}
              >
                {signal.dayChange > 0 ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {signal.dayChange.toFixed(2)}%
              </div>
              <div className="text-[10px] text-zinc-500">dari kemarin</div>
            </div>
          </div>

          {/* Score & Action */}
          <div className="flex items-center justify-between bg-zinc-950 rounded-2xl px-4 py-3 border border-zinc-800">
            <div>
              <div className="text-xs text-zinc-500">AI SCORE</div>
              <div className="text-4xl font-black tabular-nums tracking-[-2px]">
                {signal.score}
              </div>
            </div>
            <div
              className={`px-5 py-1.5 rounded-2xl text-sm font-black border ${getActionColor(signal.action)}`}
            >
              {signal.action}
            </div>
          </div>

          {/* Technical Indicators */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3">
              <div className="text-zinc-500">RSI (1D)</div>
              <div className="font-mono text-lg font-bold mt-0.5">
                {signal.rsi}
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3">
              <div className="text-zinc-500">MACD</div>
              <div className="font-mono text-lg font-bold mt-0.5">
                {signal.macd.toFixed(2)}
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3">
              <div className="text-zinc-500">Recommend</div>
              <div className="font-mono text-lg font-bold mt-0.5">
                {signal.recommendation}
              </div>
            </div>
          </div>

          {/* Analysis */}
          <div className="space-y-2 text-xs">
            <div className="text-zinc-400 leading-relaxed">
              {signal.analysis.technical}
            </div>
            <div className="text-zinc-400 leading-relaxed">
              {signal.analysis.momentum}
            </div>
            <div className="text-zinc-400 leading-relaxed">
              {signal.analysis.rsi}
            </div>
            <div className="text-zinc-400 leading-relaxed">
              {signal.analysis.macd}
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-[10px] text-zinc-600 font-mono pt-1 border-t border-zinc-800">
            Updated: {new Date(signal.timestamp).toLocaleTimeString("id-ID")}
          </div>
        </div>
      ) : (
        <div className="text-xs text-red-400 py-4">
          Gagal memuat data signal
        </div>
      )}
    </div>
  );
};

/* ================= MAIN PAGE ================= */
export default function MarketPage() {
  const [sahamList, setSahamList] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/scan");
      if (Array.isArray(res.data)) setSahamList(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSaham = useMemo(() => {
    return sahamList.filter((s) =>
      s.Kode.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [sahamList, searchTerm]);

  const totalPages = Math.ceil(filteredSaham.length / itemsPerPage);
  const currentSaham = filteredSaham.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar onSync={loadData} isLoading={isLoading} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-30%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
            Market{" "}
            <span className="text-blue-500 underline decoration-blue-600 decoration-4 underline-offset-8">
              Radar
            </span>
          </h1>
          <p className="text-zinc-500 mt-6 max-w-xl text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
            Real-time AI screening saham BEI berbasis momentum, teknikal &
            sentimen pasar.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input
              placeholder="Cari kode saham..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-2xl border border-zinc-800 hover:bg-zinc-900 transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh All
          </button>
        </div>

        {/* Grid */}
        {isLoading && sahamList.length === 0 ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[520px] bg-zinc-900/40 border border-zinc-800 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentSaham.map((s, i) => (
              <StockCard
                key={`${s.Kode}-${i}`}
                s={s}
                onMaximize={setSelectedStock}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:border-blue-500 transition"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm text-zinc-400 font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:border-blue-500 transition"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </main>

      <Footer />

      {selectedStock && (
        <AdvancedChartModal
          symbol={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}
