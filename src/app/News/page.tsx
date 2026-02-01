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
  ExternalLink,
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white p-4 md:p-10 font-sans selection:bg-blue-500">
      {/* HEADER SECTION - RESPONSIVE STACKING */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div className="w-full lg:w-auto">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
            Market{" "}
            <span className="text-blue-500 underline decoration-red-600 decoration-4 underline-offset-8">
              Predator
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              Live Pulse
            </div>
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              Synced: {lastSync.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* CATEGORY SWITCHER - MOBILE HORIZONTAL SCROLL */}
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          <div className="flex gap-2 bg-zinc-900/40 p-1.5 rounded-2xl border border-zinc-800/50 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${
                    activeCat === cat.id
                      ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                      : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                  }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN NEWS STREAM */}
      <div className="grid grid-cols-1 gap-5 max-w-5xl mx-auto mb-16">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-zinc-900/20 rounded-[32px] animate-pulse border border-zinc-900"
              />
            ))
          : currentNews.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-[#0d0d0e] border border-zinc-800/40 hover:border-blue-500/40 p-6 md:p-8 rounded-[35px] transition-all duration-500 hover:bg-zinc-900/20"
              >
                {/* ICON & SENTIMENT */}
                <div className="flex sm:flex-col items-center gap-4 shrink-0">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-transform duration-500 group-hover:scale-110
                    ${
                      item.sentiment === "positive"
                        ? "bg-green-500/10 border-green-500/20 text-green-500"
                        : item.sentiment === "negative"
                          ? "bg-red-500/10 border-red-500/20 text-red-500"
                          : "bg-zinc-800/50 border-zinc-700/50 text-zinc-500"
                    }`}
                  >
                    {item.sentiment === "positive" ? (
                      <TrendingUp size={24} />
                    ) : item.sentiment === "negative" ? (
                      <TrendingDown size={24} />
                    ) : (
                      <Clock size={24} />
                    )}
                  </div>
                  <div className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter sm:text-center">
                    {formatDistanceToNow(new Date(item.pubDate), {
                      addSuffix: false,
                      locale: id,
                    })}
                  </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 space-y-2">
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
                    className="block"
                  >
                    <h3 className="text-lg md:text-2xl font-black text-zinc-300 group-hover:text-white leading-[1.2] tracking-tight transition-colors">
                      {item.title}
                    </h3>
                  </a>
                </div>

                {/* MOBILE/DESKTOP ACTION BUTTON */}
                <div className="absolute top-6 right-6 sm:relative sm:top-0 sm:right-0">
                  <a
                    href={item.link}
                    target="_blank"
                    className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-zinc-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300 block"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
      </div>

      {/* REFINED PAGINATION */}
      {!loading && news.length > itemsPerPage && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-12 mb-20">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 disabled:opacity-20 hover:border-blue-500 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2 overflow-x-auto px-2 no-scrollbar">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
              // Menampilkan hanya beberapa halaman jika terlalu banyak
              if (
                totalPages > 5 &&
                Math.abs(num - currentPage) > 1 &&
                num !== 1 &&
                num !== totalPages
              )
                return null;
              return (
                <button
                  key={num}
                  onClick={() => paginate(num)}
                  className={`w-12 h-12 shrink-0 rounded-2xl font-black text-xs transition-all border
                    ${
                      currentPage === num
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600"
                    }`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 disabled:opacity-20 hover:border-blue-500 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
