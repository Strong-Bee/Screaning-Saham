"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EconomicCalendarWidget from "./EconomicCalendarWidget";
import { CalendarDays, Loader2 } from "lucide-react";

export default function CalendarPage() {
  const [widgetReady, setWidgetReady] = useState(false);

  // Simulasi widget siap setelah beberapa detik (opsional, bisa dilepas)
  useEffect(() => {
    const timer = setTimeout(() => setWidgetReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 lg:mt-16">
        {/* HEADER */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
            Economic{" "}
            <span className="text-blue-500 underline decoration-blue-600 decoration-4 underline-offset-4 sm:underline-offset-8">
              Calendar
            </span>
          </h2>
          <p className="mt-4 text-zinc-500 text-sm sm:text-base max-w-2xl">
            Pantau rilis data ekonomi global, event berdampak tinggi, dan
            momentum market-moving dalam satu radar.
          </p>

          {/* LIVE INDICATOR */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-600/10 border border-blue-600/20">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Live Calendar
            </div>
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              Powered by Tradays
            </span>
          </div>
        </div>

        {/* WIDGET CARD */}
        <div className="relative bg-[#0d0d0e] border border-zinc-800/40 rounded-3xl overflow-hidden shadow-xl shadow-blue-500/5 mb-16">
          {/* SKELETON LOADING (tampil jika widget belum siap) */}
          {!widgetReady && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d0d0e] gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <span className="text-sm text-zinc-500 font-mono">
                Loading economic data...
              </span>
            </div>
          )}

          {/* WIDGET CONTAINER */}
          <div className="min-h-[650px] sm:min-h-[750px] w-full p-5 sm:p-7 lg:p-8">
            <EconomicCalendarWidget />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
