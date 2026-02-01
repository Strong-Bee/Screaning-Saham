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
  Database,
  Activity,
  Menu,
  BarChart3,
  Globe,
  ExternalLink,
} from "lucide-react";

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
      className="w-full h-[180px] mt-4 overflow-hidden rounded-2xl bg-black/20 border border-zinc-800/50 shadow-inner"
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
      backgroundColor: "#0F0F0F",
      gridColor: "rgba(242, 242, 242, 0.06)",
      studies: ["RSI@tv-basicstudies"],
    });
    container.current.innerHTML = "";
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
      <div className="relative w-full h-full max-w-6xl bg-[#0F0F0F] border border-zinc-800 rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/40">
          <h2 className="text-xl font-black italic tracking-tighter uppercase text-white">
            {symbol} ANALYTICS
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-all active:scale-90"
          >
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>
        <div className="flex-1 w-full" ref={container} />
      </div>
    </div>
  );
};

// --- KOMPONEN KARTU EMITEN DENGAN SCRAPING ---
const StockCard = ({
  s,
  onMaximize,
}: {
  s: any;
  onMaximize: (symbol: string) => void;
}) => {
  const [scrapedData, setScrapedData] = useState<{ about: string } | null>(
    null,
  );
  const [isScraping, setIsScraping] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsScraping(true);
      try {
        const res = await axios.get(`/api/scrape?symbol=${s.Kode}`);
        setScrapedData(res.data);
      } catch (e) {
        console.error("Scraping failed");
      } finally {
        setIsScraping(false);
      }
    };
    fetchData();
  }, [s.Kode]);

  return (
    <div className="bg-[#0b0b0c] border border-zinc-800/60 rounded-[40px] overflow-hidden flex flex-col group hover:border-zinc-700 transition-all shadow-xl">
      <div className="p-7 pb-4 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 font-black text-2xl italic text-white group-hover:text-green-500 transition-all">
            {s.Kode[0]}
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
              {s.Kode}
            </h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1 truncate max-w-[140px]">
              {s["Nama Perusahaan"]}
            </p>
          </div>
        </div>
        <button
          onClick={() => onMaximize(s.Kode)}
          className="p-3.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-green-500 transition-all"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      <div className="px-7">
        <TradingViewWidget symbol={s.Kode} />
      </div>

      <div className="p-7 space-y-8 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Live Fundamentals
            </span>
          </div>
          <div className="rounded-2xl bg-zinc-950/50 border border-zinc-800/40 overflow-hidden">
            <FinancialWidget symbol={s.Kode} />
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-zinc-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <Globe className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Tentang Perusahaan
              </span>
            </div>
            {isScraping && (
              <RefreshCw className="w-3 h-3 animate-spin text-green-500" />
            )}
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 min-h-[140px]">
            <p className="text-[11px] text-zinc-400 leading-relaxed italic line-clamp-6 font-medium">
              {scrapedData?.about ||
                "Mengekstraksi data dari intelijen market..."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`https://www.idnfinancials.com/id/${s.Kode}`}
                target="_blank"
                className="text-[9px] bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg flex items-center gap-1 transition-colors"
              >
                IDN <ExternalLink className="w-2 h-2" />
              </a>
              <a
                href={`https://www.idx.co.id/id/perusahaan-tercatat/profil-perusahaan-tercatat/${s.Kode}`}
                target="_blank"
                className="text-[9px] bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg flex items-center gap-1 transition-colors"
              >
                IDX <ExternalLink className="w-2 h-2" />
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
    { id: "radar", label: "Scanner", icon: LayoutDashboard },
    { id: "signal", label: "Signal", icon: Database },
    { id: "news", label: "News", icon: Activity },
  ];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/scan");
      if (Array.isArray(response.data)) setSahamList(response.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
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
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] font-sans pb-20 selection:bg-green-500 selection:text-black">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] w-full border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-green-500 w-8 h-8 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <h1 className="text-xl font-black tracking-tighter uppercase text-white">
                LINTANG <span className="text-green-500">PREDATOR</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase transition-all pb-1 border-b-2 ${
                    activeTab === tab.id
                      ? "text-green-500 border-green-500"
                      : "text-zinc-500 border-transparent hover:text-white"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="hidden sm:flex bg-white text-black px-5 py-2.5 rounded-xl font-black text-[10px] uppercase hover:bg-green-500 transition-all items-center gap-2 active:scale-95 disabled:opacity-30"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />{" "}
              SYNC DATA
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 transition-transform active:scale-90"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-green-500" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        <div
          className={`absolute top-20 left-0 w-full bg-[#050505] border-b border-zinc-800 md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
        >
          <div className="p-6 flex flex-col gap-4 bg-black/95 backdrop-blur-2xl">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl font-black uppercase text-xs transition-all ${activeTab === tab.id ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-zinc-900/50 text-zinc-500 border border-transparent"}`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
            <button
              onClick={() => {
                loadData();
                setIsMenuOpen(false);
              }}
              className="mt-2 flex items-center justify-center gap-2 p-4 bg-white text-black rounded-2xl font-black uppercase text-[10px]"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />{" "}
              SYNC MARKET DATA
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-10">
        {activeTab === "radar" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">
                Market <span className="text-zinc-800">Analyzer</span>
              </h2>
              <div className="relative w-full md:w-[400px] group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="text"
                  placeholder="IDENTIFIKASI KODE SAHAM..."
                  className="w-full bg-zinc-900/20 border border-zinc-800 p-5 pl-14 rounded-[22px] outline-none focus:border-green-500/50 uppercase font-black text-xs transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {currentSaham.map((s, i) => (
                <StockCard
                  key={`${s.Kode}-${i}`}
                  s={s}
                  onMaximize={setSelectedStock}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-20 pt-10 border-t border-zinc-900">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => p - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 disabled:opacity-10 hover:border-zinc-500 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="bg-zinc-900/80 px-6 py-3 rounded-2xl border border-zinc-800 font-black text-[10px] text-zinc-500 tracking-[0.3em]">
                  {currentPage} / {totalPages}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 disabled:opacity-10 hover:border-zinc-500 transition-all"
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
