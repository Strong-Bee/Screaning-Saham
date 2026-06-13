"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EconomicCalendarWidget from "./EconomicCalendarWidget";

export default function CalendarPage() {
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
            Pantau rilis data ekonomi global, event berdampak tinggi, dan waktu
            market moving news dalam satu radar.
          </p>
        </div>

        {/* WIDGET CARD */}
        <div className="bg-[#0d0d0e] border border-zinc-800/40 rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xl mb-16">
          <div className="min-h-[600px] sm:min-h-[700px] w-full">
            <EconomicCalendarWidget />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
