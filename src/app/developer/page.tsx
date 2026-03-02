"use client";

import React from "react";
import { Github, Linkedin, Code2, Cpu, Globe } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ================= CREATOR ================= */
const CREATOR = {
  name: "Lintang",
  role: "Creator & System Architect",
  bio: "Developer independen di balik Lintang Predator — sistem AI market intelligence untuk Bursa Efek Indonesia yang menggabungkan data real-time, algoritma screening, dan visualisasi predator-grade.",
  tech: [
    "Next.js",
    "TypeScript",
    "Python",
    "AI Integration",
    "TradingView",
    "Financial Data",
  ],
};

/* ================= PAGE ================= */
export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* glow bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-25%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[140px] rounded-full" />
          <div className="absolute bottom-[-25%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* label kecil */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-10 bg-blue-500 rounded-full" />
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.35em]">
              System Core
            </span>
          </div>

          {/* HEADING CONSISTENT */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
            Developer{" "}
            <span className="text-blue-500 underline decoration-blue-600 decoration-4 underline-offset-4 sm:underline-offset-8">
              Architecture
            </span>
          </h2>

          {/* desc */}
          <p className="mt-6 max-w-xl text-zinc-400 text-sm sm:text-base leading-relaxed">
            Struktur pengembangan dan arsitektur sistem di balik Lintang
            Predator — platform AI market intelligence untuk analisis saham
            Indonesia.
          </p>
        </div>
      </section>

      {/* CREATOR CARD */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative bg-[#0b0b0c] border border-zinc-800 rounded-3xl p-6 sm:p-10 hover:border-blue-500/40 transition overflow-hidden">
          {/* glow line */}
          <div className="absolute left-0 top-0 h-full w-[3px] bg-blue-500/40" />

          <div className="flex flex-col md:flex-row gap-8 md:gap-10">
            {/* icon */}
            <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 w-fit">
              <Cpu className="w-8 h-8 text-blue-500" />
            </div>

            {/* content */}
            <div className="flex-1">
              <h3 className="text-3xl sm:text-4xl font-black italic tracking-tight">
                {CREATOR.name}
              </h3>

              <p className="text-blue-500 text-xs font-black uppercase tracking-wider mt-1">
                {CREATOR.role}
              </p>

              <p className="text-zinc-400 text-sm mt-6 leading-relaxed max-w-2xl">
                {CREATOR.bio}
              </p>

              {/* social */}
              <div className="flex gap-3 mt-6">
                <SocialLink icon={<Github className="w-4 h-4" />} />
                <SocialLink icon={<Linkedin className="w-4 h-4" />} />
              </div>

              {/* tech */}
              <div className="mt-10 pt-6 border-t border-zinc-800">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 mb-3">
                  <Code2 className="w-3 h-3" />
                  Tech Stack
                </div>

                <div className="flex flex-wrap gap-2">
                  {CREATOR.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-400 hover:border-blue-500/40 transition"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative max-w-5xl mx-auto text-center bg-gradient-to-b from-zinc-900/40 to-transparent border border-zinc-800 rounded-3xl p-10 sm:p-14 overflow-hidden">
          <Globe className="absolute inset-0 m-auto w-72 h-72 text-zinc-800/10" />

          <h3 className="text-2xl sm:text-4xl font-black italic leading-tight">
            Building the Future of{" "}
            <span className="text-blue-500">AI Market Intelligence</span>
          </h3>

          <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
            Lintang Predator dikembangkan sebagai platform analitik pasar saham
            berbasis AI untuk memberikan insight cepat, objektif, dan berbasis
            data bagi trader Indonesia dalam memahami pergerakan smart money dan
            dinamika pasar modern.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ================= SOCIAL ================= */
function SocialLink({ icon }: { icon: React.ReactNode }) {
  return (
    <a
      href="#"
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-blue-400 hover:border-blue-500 transition"
    >
      {icon}
    </a>
  );
}
