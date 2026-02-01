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
  Database, // Tambahkan ini
  Activity,
  Bell,
  Menu,
} from "lucide-react";

// Import komponen internal Tuan
// Pastikan file ini ada di: src/app/Signal/page.tsx dan src/app/News/page.tsx
import SignalSection from "./Signal/page";
import NewsSection from "./News/page";

// --- WIDGET MINI ---
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
      height: "200",
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
      className="w-full h-[200px] mt-4 overflow-hidden rounded-2xl bg-black/20"
      ref={container}
    />
  );
};

// --- MODAL FULL CHART ---
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
      <div className="relative w-full h-full max-w-6xl bg-[#0F0F0F] border border-zinc-800 rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/40">
          <h2 className="text-xl font-black italic tracking-tighter uppercase">
            {symbol} <span className="text-green-500">PRO CHART</span>
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

export default function LintangPredatorDashboard() {
  const [activeTab, setActiveTab] = useState<"radar" | "signal" | "news">(
    "radar",
  );
  const [sahamList, setSahamList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadJsonData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/scan");
      if (Array.isArray(response.data)) setSahamList(response.data);
    } catch (error) {
      console.error("Load Error:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    loadJsonData();
  }, []);

  const filteredSaham = useMemo(() => {
    return sahamList.filter((s) =>
      (s.Kode || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [sahamList, searchTerm]);

  const totalPages = Math.ceil(filteredSaham.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSaham = filteredSaham.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] font-sans pb-20 selection:bg-green-500 selection:text-black">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-green-500 w-8 h-8 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <h1 className="text-xl font-black tracking-tighter uppercase text-white hidden sm:block">
                LINTANG <span className="text-green-500">PREDATOR</span>
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {[
                { id: "radar", label: "Radar", icon: LayoutDashboard },
                { id: "signal", label: "Signal", icon: Database },
                { id: "news", label: "News", icon: Activity },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase transition-all pb-1 border-b-2 ${
                    activeTab === tab.id
                      ? "text-green-500 border-green-500 shadow-[0_10px_10px_-10px_rgba(34,197,94,0.5)]"
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
              onClick={loadJsonData}
              disabled={isLoading || activeTab !== "radar"}
              className="bg-white text-black px-5 py-2.5 rounded-xl font-black text-[10px] uppercase hover:bg-green-500 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-30"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />{" "}
              SYNC
            </button>
            <button className="md:hidden p-2 text-zinc-400">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-10">
        {activeTab === "radar" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                  Market <span className="text-zinc-700">Scanner</span>
                </h2>
                <p className="text-zinc-500 text-sm font-bold mt-2 italic">
                  Monitoring {filteredSaham.length} emiten.
                </p>
              </div>
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="text"
                  placeholder="CARI KODE SAHAM..."
                  className="w-full bg-zinc-900/40 border border-zinc-800 p-4 pl-12 rounded-2xl outline-none focus:border-green-500 uppercase font-black text-xs transition-all focus:bg-zinc-900/80 shadow-inner"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {currentSaham.length > 0 ? (
                currentSaham.map((s, index) => (
                  <div
                    key={`${s.Kode}-${index}`}
                    className="bg-[#0d0d0e] border border-zinc-800 p-6 rounded-[32px] hover:border-zinc-600 transition-all group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black italic group-hover:text-green-500 uppercase leading-none transition-colors tracking-tight">
                          {s.Kode}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase truncate max-w-[180px] mt-2">
                          {s["Nama Perusahaan"]}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedStock(s.Kode)}
                        className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-green-500 hover:border-green-500/50 transition-all active:scale-90"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                    <TradingViewWidget symbol={s.Kode} />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-[32px]">
                  <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">
                    Emiten Tidak Ditemukan
                  </p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-800 pt-10">
                <div className="bg-zinc-900/40 px-5 py-2.5 rounded-full border border-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Data{" "}
                  <span className="text-white">
                    {indexOfFirstItem + 1} -{" "}
                    {Math.min(indexOfLastItem, filteredSaham.length)}
                  </span>{" "}
                  of <span className="text-white">{filteredSaham.length}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((prev) => prev - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/50 disabled:opacity-20 hover:border-zinc-500 transition-all active:scale-90"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((prev) => prev + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/50 disabled:opacity-20 hover:border-zinc-500 transition-all active:scale-90"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
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
