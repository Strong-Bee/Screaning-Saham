"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Layers,
  PieChart,
  Target,
  Zap,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ================= TYPES ================= */
interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  sentiment: "positive" | "negative" | "neutral";
  pubDate: string;
}

/* ================= CATEGORIES ================= */
const CATEGORIES = [
  { id: "all", name: "All Intel", icon: Layers },
  { id: "dividend", name: "Dividen", icon: PieChart },
  { id: "ipo", name: "IPO Radar", icon: Target },
  { id: "macro", name: "Macro", icon: Zap },
];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeCat, setActiveCat] = useState("all");
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  /* ================= FETCH ================= */
  const fetchNews = async (cat = activeCat, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${cat}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setNews(data);
        setLastSync(new Date());
        setCurrentPage(1);
      }
    } catch (e) {
      console.error("News fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeCat);
    const timer = setInterval(() => fetchNews(activeCat, true), 30000);
    return () => clearInterval(timer);
  }, [activeCat]);

  /* ================= PAGINATION ================= */
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentNews = news.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(news.length / itemsPerPage);

  const paginate = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* NAVBAR */}
      <Navbar
        activeTab="news"
        setActiveTab={() => {}}
        onSync={() => fetchNews(activeCat)}
        isLoading={loading}
      />

      {/* CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 lg:mt-16">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 sm:mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
              Market{" "}
              <span className="text-blue-500 underline decoration-blue-600 decoration-4 underline-offset-4 sm:underline-offset-8">
                Predator
              </span>
            </h2>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-600/10 border border-blue-600/20">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                Live Intel
              </div>

              <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                Synced: {lastSync.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar">
            <div className="flex gap-2 bg-zinc-900/40 p-1.5 rounded-2xl border border-zinc-800/50 min-w-max">
              {CATEGORIES.map((cat) => {
                const isActive = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.35)]"
                        : "bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-white"
                    }`}
                  >
                    <cat.icon className="w-3.5 h-3.5" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* NEWS LIST */}
        <div className="grid gap-4 sm:gap-5 max-w-5xl mx-auto mb-14 sm:mb-16">
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-28 sm:h-32 bg-zinc-900/20 rounded-[28px] animate-pulse border border-zinc-900"
                />
              ))
            : currentNews.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-[#0d0d0e] border border-zinc-800/40 hover:border-blue-500/40 p-4 sm:p-6 md:p-8 rounded-[28px] sm:rounded-[35px] transition-all duration-500 hover:bg-zinc-900/20"
                >
                  {/* ICON */}
                  <div className="flex sm:flex-col items-center gap-3 sm:gap-4 shrink-0">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border-2 ${
                        item.sentiment === "positive"
                          ? "bg-green-500/10 border-green-500/20 text-green-500"
                          : item.sentiment === "negative"
                            ? "bg-red-500/10 border-red-500/20 text-red-500"
                            : "bg-zinc-800/50 border-zinc-700/50 text-zinc-500"
                      }`}
                    >
                      {item.sentiment === "positive" ? (
                        <TrendingUp size={20} />
                      ) : item.sentiment === "negative" ? (
                        <TrendingDown size={20} />
                      ) : (
                        <Clock size={20} />
                      )}
                    </div>

                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">
                      {formatDistanceToNow(new Date(item.pubDate), {
                        locale: id,
                      })}
                    </div>
                  </div>

                  {/* TEXT */}
                  <div className="flex-1 space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">
                        {item.source}
                      </span>
                      <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                      <span className="text-[10px] font-bold text-zinc-700 uppercase">
                        Intel Verified
                      </span>
                    </div>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-zinc-300 group-hover:text-white leading-tight transition-colors">
                        {item.title}
                      </h3>
                    </a>
                  </div>

                  {/* OPEN BUTTON */}
                  <div className="sm:ml-auto">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open news source"
                      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl 
                      bg-zinc-900 border border-zinc-800 text-zinc-500
                      hover:bg-blue-600 hover:text-white hover:border-blue-500
                      transition-all duration-300 active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  </div>
                </div>
              ))}
        </div>

        {/* PAGINATION */}
        {!loading && news.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-3 sm:gap-6 mb-14 sm:mb-16">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 disabled:opacity-20 hover:border-blue-500 hover:text-blue-400 transition-all"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm font-black text-zinc-400">
              {currentPage} / {totalPages}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 disabled:opacity-20 hover:border-blue-500 hover:text-blue-400 transition-all"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
