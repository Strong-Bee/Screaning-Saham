"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: `IDX:${symbol}`,
      width: "100%",
      height: 180,
      locale: "id",
      dateRange: "12M",
      colorTheme: "dark",
      isTransparent: true,
      autosize: true,
    });

    ref.current.innerHTML = "";
    ref.current.appendChild(script);

    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [symbol]);

  return (
    <div
      ref={ref}
      className="w-full h-[180px] rounded-2xl overflow-hidden border border-zinc-800 bg-black/40"
    />
  );
};

/* ================= MODAL ================= */
const ChartModal = ({
  symbol,
  onClose,
}: {
  symbol: string;
  onClose: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: `IDX:${symbol}`,
      autosize: true,
      interval: "D",
      timezone: "Asia/Jakarta",
      theme: "dark",
      style: "1",
      locale: "id",
    });

    ref.current.innerHTML = "";
    ref.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[80vh] bg-[#050505] border border-zinc-800 rounded-3xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h3 className="font-black">{symbol} Chart</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-red-500/10 hover:text-red-500"
          >
            <X />
          </button>
        </div>

        <div ref={ref} className="flex-1" />
      </div>
    </div>
  );
};

/* ================= STOCK CARD ================= */
const StockCard = ({
  stock,
  onOpen,
}: {
  stock: StockItem;
  onOpen: (s: string) => void;
}) => {
  return (
    <div className="bg-[#0b0b0c] border border-zinc-800 rounded-3xl p-6 flex flex-col gap-4 hover:border-blue-500/40 transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-black tracking-tight">{stock.Kode}</h3>
          <p className="text-xs text-zinc-500">{stock["Nama Perusahaan"]}</p>
        </div>

        <button
          onClick={() => onOpen(stock.Kode)}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 hover:text-blue-400 transition"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      <TradingViewWidget symbol={stock.Kode} />
    </div>
  );
};

/* ================= PAGE ================= */
export default function HomePage() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  const itemsPerPage = 6;

  const loadStocks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/scan");
      if (Array.isArray(res.data)) setStocks(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const filtered = useMemo(() => {
    return stocks.filter((s) =>
      s.Kode.toLowerCase().includes(search.toLowerCase()),
    );
  }, [stocks, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const currentData = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* NAVBAR */}
      <Navbar onSync={loadStocks} isLoading={loading} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-30%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[140px] rounded-full" />
          <div className="absolute bottom-[-30%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
            Market{" "}
            <span className="text-blue-500 underline decoration-blue-600 decoration-4 underline-offset-4 sm:underline-offset-8">
              Radar
            </span>
          </h2>

          <p className="text-zinc-400 mt-3 max-w-xl text-sm sm:text-base">
            AI stock scanner Bursa Efek Indonesia berbasis momentum,
            fundamental, dan sentimen pasar.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* SEARCH */}
        <div className="flex justify-end mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              placeholder="Search ticker..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[260px] bg-zinc-900/40 border border-zinc-800 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentData.map((s) => (
              <StockCard key={s.Kode} stock={s} onOpen={setSelected} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-20 hover:border-blue-500"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm">
              {page} / {totalPages}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-20 hover:border-blue-500"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>

      <Footer />

      {selected && (
        <ChartModal symbol={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
