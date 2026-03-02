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
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ================= TYPES ================= */
interface StockItem {
  Kode: string;
  "Nama Perusahaan": string;
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
      height: "180",
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
      className="w-full h-[180px] rounded-2xl overflow-hidden bg-black/40 border border-zinc-800"
    />
  );
};

/* ================= MODAL ================= */
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
      <div className="w-full max-w-6xl h-[85vh] bg-[#050505] border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
          <h2 className="font-black text-lg tracking-wide">
            {symbol} Advanced Chart
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition"
          >
            <X />
          </button>
        </div>

        <div ref={container} className="flex-1" />
      </div>
    </div>
  );
};

/* ================= STOCK CARD ================= */
const StockCard = ({
  s,
  onMaximize,
}: {
  s: StockItem;
  onMaximize: (symbol: string) => void;
}) => {
  const [intel, setIntel] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIntel = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/signal?symbol=${s.Kode}`);
        setIntel(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchIntel();
  }, [s.Kode]);

  return (
    <div className="bg-[#0b0b0c] border border-zinc-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 hover:border-blue-500/40 transition relative">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight">
            {s.Kode}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-1">
            {s["Nama Perusahaan"]}
          </p>
        </div>

        <button
          onClick={() => onMaximize(s.Kode)}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 hover:text-blue-400 transition"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      <TradingViewWidget symbol={s.Kode} />

      <div className="text-xs text-zinc-400 min-h-[42px] leading-relaxed">
        {loading ? (
          <RefreshCw className="animate-spin text-blue-500" />
        ) : (
          (intel?.analysis?.fundamental ?? "No analysis available")
        )}
      </div>
    </div>
  );
};

/* ================= PAGE ================= */
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

      {/* HERO — CONSISTENT BRAND */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-30%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[140px] rounded-full" />
          <div className="absolute bottom-[-30%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
            Market{" "}
            <span className="text-blue-500 underline decoration-blue-600 decoration-4 underline-offset-8">
              Radar
            </span>
          </h1>

          <p className="text-zinc-500 mt-6 max-w-xl text-xs md:text-sm font-bold uppercase tracking-[0.2em] leading-relaxed">
            Real-time AI screening saham Bursa Efek Indonesia berbasis momentum,
            fundamental, dan sentimen pasar.
          </p>
        </div>
      </section>

      {/* SEARCH + GRID */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input
              placeholder="Search ticker..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[260px] bg-zinc-900/40 border border-zinc-800 rounded-3xl animate-pulse"
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

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-20 hover:border-blue-500 hover:text-blue-400 transition"
            >
              <ChevronLeft />
            </button>

            <span className="text-sm text-zinc-400">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-20 hover:border-blue-500 hover:text-blue-400 transition"
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
