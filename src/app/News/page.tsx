"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  RefreshCw,
  Zap,
  TrendingUp,
  TrendingDown,
  Target,
  PieChart,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

const CATEGORIES = [
  { id: "all", name: "All Intel", icon: Layers },
  { id: "dividend", name: "Dividen", icon: PieChart },
  { id: "ipo", name: "IPO Radar", icon: Target },
  { id: "macro", name: "Macro", icon: Zap },
];

export default function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState("all");
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Jumlah berita per halaman

  const fetchNews = async (cat = activeCat, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${cat}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setNews(data);
        setLastSync(new Date());
        setCurrentPage(1); // Reset ke hal 1 setiap ganti kategori
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeCat);
    const timer = setInterval(() => fetchNews(activeCat, true), 30000);
    return () => clearInterval(timer);
  }, [activeCat]);

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white p-4 md:p-10 font-sans">
      {/* Header & Sync Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Market{" "}
            <span className="text-blue-500 underline decoration-red-600">
              Predator
            </span>
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-600/10 border border-red-600/20 rounded text-[9px] font-black text-red-500 uppercase">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />{" "}
              Live Pulse
            </div>
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
              Last Update: {lastSync.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Category Switcher */}
        <div className="flex flex-wrap gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all
                ${activeCat === cat.id ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main News Stream */}
      <div className="grid grid-cols-1 gap-4 max-w-6xl mb-10">
        {loading
          ? [1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-28 bg-zinc-900/30 rounded-[24px] animate-pulse border border-zinc-900"
              />
            ))
          : currentNews.map((item, i) => (
              <div
                key={item.id}
                className="group flex flex-col md:flex-row md:items-center gap-4 bg-[#0d0d0e] border border-zinc-900 hover:border-blue-500/50 p-5 rounded-[28px] transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
              >
                {/* Indicator & Time */}
                <div className="flex md:flex-col items-center gap-3 md:min-w-[100px]">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all
                  ${
                    item.sentiment === "positive"
                      ? "bg-green-500/10 border-green-500/20 text-green-500"
                      : item.sentiment === "negative"
                        ? "bg-red-500/10 border-red-500/20 text-red-500"
                        : "bg-zinc-800 border-zinc-700 text-zinc-500"
                  }`}
                  >
                    {item.sentiment === "positive" ? (
                      <TrendingUp />
                    ) : item.sentiment === "negative" ? (
                      <TrendingDown />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-zinc-600 uppercase text-center">
                    {formatDistanceToNow(new Date(item.pubDate), {
                      addSuffix: false,
                      locale: id,
                    })}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest">
                      {item.source}
                    </span>
                    <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                    <span className="text-[9px] font-black uppercase text-zinc-700">
                      Verified Intel
                    </span>
                  </div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <h3 className="text-lg md:text-xl font-bold text-zinc-300 group-hover:text-white leading-tight">
                      {item.title}
                    </h3>
                  </a>
                </div>

                {/* Action */}
                <div className="hidden md:block">
                  <a
                    href={item.link}
                    target="_blank"
                    className="p-3 bg-zinc-900 rounded-2xl group-hover:bg-blue-600 transition-all block"
                  >
                    <Zap className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                  </a>
                </div>
              </div>
            ))}
      </div>

      {/* --- Predator Pagination UI --- */}
      {!loading && news.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-8 pb-10">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:text-blue-500 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => paginate(num)}
                className={`w-10 h-10 rounded-xl font-black text-xs transition-all border
                  ${
                    currentPage === num
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                  }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:text-blue-500 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
