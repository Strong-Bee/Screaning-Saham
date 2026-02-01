"use client";
import React from "react";
import { Clock, ExternalLink, Globe } from "lucide-react";

const newsItems = [
  {
    time: "2m ago",
    title: "IHSG Berpotensi Menguat Menjelang Rilis Data Inflasi",
    source: "Market Intel",
  },
  {
    time: "45m ago",
    title: "ASII Melaporkan Kenaikan Laba Bersih Q4 Sebesar 12%",
    source: "Corporate Action",
  },
  {
    time: "2h ago",
    title: "Sektor Perbankan Pimpin Penguatan Sesi I",
    source: "IDX News",
  },
];

export default function NewsSection() {
  return (
    <div className="animate-in slide-in-from-bottom duration-700">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Market <span className="text-blue-500">Intelligence</span>
          </h2>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
            Real-time global & local financial logs
          </p>
        </div>
        <Globe className="w-8 h-8 text-zinc-800" />
      </div>

      <div className="space-y-4">
        {newsItems.map((item, i) => (
          <div
            key={i}
            className="group relative pl-8 pb-8 border-l border-zinc-800 last:border-0"
          >
            {/* Timeline Dot */}
            <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-zinc-700 group-hover:bg-blue-500 rounded-full transition-colors border-4 border-[#050505] box-content" />

            <div className="bg-zinc-900/20 border border-zinc-900 group-hover:border-zinc-800 p-5 rounded-2xl transition-all">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  {item.time}
                </span>
                <span className="text-zinc-800 text-[10px]">|</span>
                <span className="text-[10px] font-black uppercase tracking-tighter text-blue-500/70">
                  {item.source}
                </span>
              </div>
              <h4 className="text-lg font-bold text-zinc-300 group-hover:text-white transition-colors cursor-pointer flex items-center gap-2 leading-tight">
                {item.title}{" "}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* TRADINGVIEW NEWS WIDGET PLACEHOLDER */}
      <div className="mt-10 p-8 border-2 border-dashed border-zinc-900 rounded-[32px] text-center">
        <p className="text-zinc-700 font-black text-[10px] uppercase tracking-[0.4em]">
          Integration Ready: TradingView News API
        </p>
      </div>
    </div>
  );
}
