"use client";

import React from "react";
import { Github, Linkedin, Code2, Cpu, Globe, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ================= CREATOR ================= */
const CREATOR = {
  name: "Lintang",
  role: "Creator & System Architect",
  tagline: "AI Market Intelligence Engineer",
  bio: `Lintang Predator dikembangkan secara independen sebagai platform AI market intelligence 
  untuk Bursa Efek Indonesia. Sistem ini menggabungkan data real-time, algoritma screening, 
  dan visualisasi predator-grade untuk membantu trader memahami pergerakan smart money, 
  momentum, dan sentimen pasar secara objektif.`,
  tech: [
    "Next.js 16",
    "TypeScript",
    "Python",
    "AI Integration",
    "TradingView",
    "Financial Data",
    "Market Screening",
  ],
};

/* ================= PAGE ================= */
export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-blue-500/30">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* background ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-5%] w-[45%] h-[60%] bg-blue-600/15 blur-[160px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-5%] w-[45%] h-[60%] bg-blue-500/10 blur-[160px] rounded-full" />
          {/* subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16"
        >
          {/* label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full" />
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">
              System Core
            </span>
          </div>

          {/* HEADING */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
            Developer{" "}
            <span className="relative text-blue-500">
              Architecture
              <span className="absolute -inset-x-2 bottom-1 h-4 bg-blue-500/20 blur-sm rounded-full" />
            </span>
          </h2>

          {/* desc */}
          <p className="mt-6 max-w-2xl text-zinc-400 text-sm sm:text-base leading-relaxed md:text-lg">
            Struktur pengembangan dan arsitektur sistem di balik{" "}
            <span className="text-blue-500 font-semibold">
              Lintang Predator
            </span>{" "}
            — platform AI market intelligence untuk analisis saham Indonesia
            berbasis data real-time dan algoritma screening predator-grade.
          </p>
        </motion.div>
      </section>

      {/* CREATOR CARD */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
      >
        <div className="relative bg-[#0b0b0c] border border-zinc-800/80 rounded-3xl p-6 sm:p-10 transition-all duration-300 hover:border-blue-500/50 overflow-hidden group">
          {/* glow accent left */}
          <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-blue-500 via-blue-400 to-transparent" />
          {/* subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-8 md:gap-10 relative z-10">
            {/* icon */}
            <div className="p-5 bg-zinc-900/80 rounded-2xl border border-zinc-800 w-fit h-fit backdrop-blur-sm">
              <Cpu className="w-8 h-8 text-blue-500 drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
            </div>

            {/* content */}
            <div className="flex-1">
              <h3 className="text-3xl sm:text-4xl font-black italic tracking-tight">
                {CREATOR.name}
              </h3>
              <p className="text-blue-500 text-xs font-black uppercase tracking-widest mt-1">
                {CREATOR.role}
              </p>
              <p className="text-zinc-500 text-xs uppercase tracking-[0.25em] mt-2">
                {CREATOR.tagline}
              </p>

              <p className="text-zinc-400 text-sm mt-6 leading-relaxed max-w-2xl">
                {CREATOR.bio}
              </p>

              {/* social */}
              <div className="flex gap-3 mt-6">
                <SocialLink
                  href="https://github.com/"
                  icon={<Github className="w-4 h-4" />}
                />
                <SocialLink
                  href="https://linkedin.com/"
                  icon={<Linkedin className="w-4 h-4" />}
                />
              </div>

              {/* tech */}
              <div className="mt-10 pt-6 border-t border-zinc-800/70">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 mb-4">
                  <Code2 className="w-3 h-3" />
                  Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {CREATOR.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-[11px] text-zinc-400 transition-all hover:border-blue-500/50 hover:text-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.1)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ARCHITECTURE */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-4 sm:px-6 lg:px-8 pb-24"
      >
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArchCard
            icon={<ShieldCheck className="w-5 h-5 text-blue-500" />}
            title="AI Screening Engine"
            desc="Algoritma analisis momentum, fundamental, dan sentimen untuk mendeteksi saham potensial secara real-time."
          />
          <ArchCard
            icon={<Globe className="w-5 h-5 text-blue-500" />}
            title="Market Data Layer"
            desc="Integrasi data Bursa Efek Indonesia, TradingView, dan sumber finansial untuk visualisasi intel pasar."
          />
          <ArchCard
            icon={<Cpu className="w-5 h-5 text-blue-500" />}
            title="Frontend Intelligence"
            desc="Dashboard interaktif berbasis Next.js dengan rendering cepat dan pengalaman predator-grade."
          />
        </div>
      </motion.section>

      {/* VISION */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="px-4 sm:px-6 lg:px-8 pb-24"
      >
        <div className="relative max-w-5xl mx-auto text-center bg-gradient-to-b from-zinc-900/40 to-transparent border border-zinc-800/80 rounded-3xl p-10 sm:p-14 overflow-hidden group hover:border-blue-500/30 transition">
          <Globe className="absolute inset-0 m-auto w-72 h-72 text-zinc-800/15 group-hover:text-blue-900/10 transition-colors duration-500" />
          <h3 className="text-2xl sm:text-4xl font-black italic leading-tight relative">
            Building the Future of{" "}
            <span className="text-blue-500">AI Market Intelligence</span>
          </h3>
          <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base relative">
            Lintang Predator dirancang sebagai infrastruktur analitik pasar
            saham generasi baru yang memberikan insight cepat, objektif, dan
            berbasis data bagi trader Indonesia dalam memahami dinamika smart
            money dan momentum pasar modern.
          </p>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}

/* ================= ARCH CARD ================= */
function ArchCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-[#0b0b0c] border border-zinc-800/80 rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_4px_24px_rgba(59,130,246,0.08)] hover:-translate-y-1 group">
      <div className="flex items-center gap-2 text-blue-500 mb-3 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition">
        {icon}
      </div>
      <h4 className="font-black text-lg mb-2">{title}</h4>
      <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ================= SOCIAL ================= */
function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 transition-all hover:text-blue-400 hover:border-blue-500 hover:bg-zinc-800 hover:scale-110 active:scale-95"
    >
      {icon}
    </a>
  );
}
