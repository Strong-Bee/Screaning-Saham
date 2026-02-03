"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import {
  RefreshCw,
  Search,
  ShieldAlert,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Zap,
  Activity,
  Menu,
  BarChart3,
  Globe,
  ExternalLink,
  TrendingUp,
  Code2, // Icon untuk Developer
} from "lucide-react";
import Link from "next/link"; // Tambahkan Link untuk navigasi ke page developer

import SignalSection from "./Signal/page";
import NewsSection from "./News/page";

// --- WIDGET MINI CHART ---
const TradingViewWidget = ({ symbol }: { symbol: string }) => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
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
    currentContainer.innerHTML = "";
    currentContainer.appendChild(script);
    return () => {
      if (currentContainer) currentContainer.innerHTML = "";
    };
  }, [symbol]);
  return (
    <div
      className="w-full h-[180px] mt-4 overflow-hidden rounded-[24px] bg-black/40 border border-zinc-800/50 shadow-inner"
      ref={container}
    />
  );
};

// --- WIDGET FINANCIAL ---
const FinancialWidget = ({ symbol }: { symbol: string }) => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: "280",
      colorTheme: "dark",
      symbol: `IDX:${symbol}`,
      locale: "id",
    });
    currentContainer.innerHTML = "";
    currentContainer.appendChild(script);
    return () => {
      if (currentContainer) currentContainer.innerHTML = "";
    };
  }, [symbol]);
  return <div className="w-full h-[280px]" ref={container} />;
};

// --- MODAL ADVANCED CHART ---
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
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `IDX:${symbol}`,
      interval: "D",
      timezone: "Asia/Jakarta",
      theme: "dark",
      style: "1",
      locale: "id",
      hide_side_toolbar: false,
      allow_symbol_change: true,
      save_image: true,
      backgroundColor: "#050505",
      gridColor: "rgba(242, 242, 242, 0.06)",
      studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
    });
    container.current.innerHTML = "";
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 md:p-8">
      <div className="relative w-full h-full max-w-7xl bg-[#050505] border border-zinc-800 rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-xl font-black italic tracking-tighter uppercase text-white">
              {symbol} PREDATOR ANALYTICS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all active:scale-90 text-zinc-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 w-full" ref={container} />
      </div>
    </div>
  );
};

// --- KOMPONEN KARTU EMITEN ---
const StockCard = ({
  s,
  onMaximize,
}: {
  s: any;
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
        console.error("Intel fetch failed for", s.Kode);
      } finally {
        setLoading(false);
      }
    };
    fetchIntel();
  }, [s.Kode]);

  return (
    <div className="bg-[#0b0b0c] border border-zinc-800/60 rounded-[40px] overflow-hidden flex flex-col group hover:border-green-500/30 transition-all duration-500 shadow-2xl">
      <div className="p-8 pb-4 flex justify-between items-start">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 bg-zinc-900 rounded-[22px] flex items-center justify-center border border-zinc-800 font-black text-2xl italic text-white group-hover:bg-green-600 group-hover:text-black transition-all duration-500 uppercase">
              {s.Kode.substring(0, 2)}
            </div>
            {intel?.score > 80 && (
              <div className="absolute -top-2 -right-2 bg-green-500 p-1.5 rounded-lg shadow-lg">
                <Zap className="w-3 h-3 text-black fill-black" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
                {s.Kode}
              </h3>
              {intel?.price && (
                <span className="text-green-500 text-[10px] font-black tracking-tighter bg-green-500/10 px-2 py-0.5 rounded">
                  Rp{intel.price.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase mt-1.5 tracking-wider truncate max-w-[150px]">
              {s["Nama Perusahaan"]}
            </p>
          </div>
        </div>
        <button
          onClick={() => onMaximize(s.Kode)}
          className="p-4 bg-zinc-900 border border-zinc-800 rounded-[20px] text-zinc-500 hover:text-green-500 hover:border-green-500/50 transition-all active:scale-95"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      <div className="px-8">
        <TradingViewWidget symbol={s.Kode} />
      </div>

      <div className="p-8 space-y-8 flex-1">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500">
              <BarChart3 className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                Financial Matrix
              </span>
            </div>
            {loading && (
              <RefreshCw className="w-3 h-3 animate-spin text-green-500" />
            )}
          </div>
          <div className="rounded-[28px] bg-black/40 border border-zinc-800/40 overflow-hidden shadow-inner">
            <FinancialWidget symbol={s.Kode} />
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 mb-4">
            <Globe className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
              Company Intelligence
            </span>
          </div>
          <div className="p-6 rounded-[28px] bg-zinc-900/30 border border-zinc-800/50">
            <p className="text-[11px] text-zinc-400 leading-relaxed italic line-clamp-4 font-medium">
              {intel?.analysis?.fundamental ||
                "Connecting to Intelligence Engine..."}
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={`https://www.google.com/finance/quote/${s.Kode}:IDX`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-[9px] font-black uppercase p-3 bg-zinc-800 rounded-xl hover:bg-green-600 hover:text-black transition-all"
              >
                Google Finance
              </a>
              <a
                href={`https://www.tradingview.com/symbols/IDX-${s.Kode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-zinc-800 rounded-xl hover:bg-blue-600 transition-all text-white"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD UTAMA ---
export default function LintangPredatorDashboard() {
  const [activeTab, setActiveTab] = useState<"radar" | "signal" | "news">(
    "radar",
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sahamList, setSahamList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navItems = [
    { id: "radar", label: "Market Radar", icon: LayoutDashboard },
    { id: "signal", label: "Predator Signal", icon: Zap },
    { id: "news", label: "Intel Stream", icon: Activity },
  ];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/scan");
      if (Array.isArray(response.data)) {
        setSahamList(response.data);
      }
    } catch (e) {
      console.error("Critical: Market scan API failed", e);
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSaham = useMemo(() => {
    return sahamList.filter((s) =>
      (s.Kode || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [sahamList, searchTerm]);

  const totalPages = Math.ceil(filteredSaham.length / itemsPerPage);
  const currentSaham = filteredSaham.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500 selection:text-black pb-10">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] w-full border-b border-zinc-800/50 bg-black/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <ShieldAlert className="text-black w-6 h-6" />
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">
                LINTANG <span className="text-green-500">PREDATOR</span>
              </h1>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest transition-all relative py-2 ${
                    activeTab === tab.id
                      ? "text-green-500"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  )}
                </button>
              ))}
              {/* Link Khusus ke Developer Page */}
              <Link
                href="/developer"
                className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all py-2"
              >
                <Code2 className="w-4 h-4" /> Dev Arch
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="hidden md:flex bg-white text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-green-500 transition-all items-center gap-2 active:scale-95 disabled:opacity-30 shadow-xl"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />{" "}
              SYNC ENGINE
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-green-500" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-24 left-0 w-full bg-[#050505] border-b border-zinc-800 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-4 p-5 rounded-[24px] font-black uppercase text-xs transition-all ${
                  activeTab === tab.id
                    ? "bg-green-500 text-black shadow-lg"
                    : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
            <Link
              href="/developer"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 p-5 rounded-[24px] font-black uppercase text-xs bg-zinc-900 text-zinc-500 border border-zinc-800"
            >
              <Code2 className="w-5 h-5" /> Developer Info
            </Link>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-16">
        {activeTab === "radar" && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
              <div>
                <div className="flex items-center gap-3 text-green-500 mb-4">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    Real-time Market Scanning
                  </span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                  Market{" "}
                  <span className="text-zinc-800 font-black not-italic">
                    Analyzer
                  </span>
                </h2>
              </div>
              <div className="relative w-full lg:w-[450px]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
                <input
                  type="text"
                  placeholder="SEARCH TICKER (BBRI, TLKM...)"
                  className="w-full bg-zinc-900/40 border border-zinc-800 p-6 pl-16 rounded-[28px] outline-none focus:border-green-500/50 uppercase font-black text-xs transition-all placeholder:text-zinc-700 shadow-2xl"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {currentSaham.length > 0 ? (
                currentSaham.map((s, i) => (
                  <StockCard
                    key={`${s.Kode}-${i}`}
                    s={s}
                    onMaximize={setSelectedStock}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-zinc-700 font-black italic uppercase tracking-widest text-2xl">
                    No Predator Target Detected
                  </p>
                </div>
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-24">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => p - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-5 rounded-[24px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-green-500 disabled:opacity-10 transition-all active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="bg-zinc-900/80 px-8 py-4 rounded-[24px] border border-zinc-800 font-black italic text-lg shadow-2xl min-w-[120px] text-center">
                  {currentPage} <span className="text-zinc-700 mx-2">/</span>{" "}
                  {totalPages}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-5 rounded-[24px] bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-green-500 disabled:opacity-10 transition-all active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "signal" && <SignalSection />}
        {activeTab === "news" && <NewsSection />}
      </main>

      {selectedStock && (
        <AdvancedChartModal
          symbol={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}
