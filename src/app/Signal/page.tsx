"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignalPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* NAVBAR */}
      <Navbar
        // activeTab="signal"
        // setActiveTab={() => {}}
        onSync={() => {}}
        isLoading={false}
      />

      {/* EMPTY CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tight text-zinc-700">
            Signal Engine
          </h2>

          <p className="text-zinc-600 text-sm">Coming soon…</p>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
