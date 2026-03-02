"use client";

import React from "react";
import Link from "next/link";
import {
  Radar,
  Brain,
  LineChart,
  ShieldCheck,
  ArrowRight,
  Activity,
  Zap,
  Database,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ================= HERO ================= */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
            <Radar className="w-4 h-4" />
            AI Stock Radar Indonesia
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Lintang Predator
            <br />
            <span className="text-zinc-400">Intelligent Market Scanner</span>
          </h1>

          <p className="mt-6 text-zinc-400 text-lg leading-relaxed">
            Platform AI untuk mendeteksi peluang saham Indonesia secara
            real-time menggunakan analisis teknikal, fundamental, dan sentimen
            pasar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              href="/Market"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
            >
              Buka Market Radar
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/Signal"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-blue-500 text-zinc-300 font-bold transition-all"
            >
              Lihat Signal AI
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= TRUST ================= */
function Trust() {
  return (
    <section className="border-y border-zinc-900 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <Stat number="800+" label="Saham Dipantau" />
        <Stat number="24/7" label="AI Monitoring" />
        <Stat number="Real-Time" label="Market Data" />
        <Stat number="IDX" label="Fokus Indonesia" />
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-black text-white">{number}</div>
      <div className="text-xs uppercase tracking-widest text-zinc-500 mt-2">
        {label}
      </div>
    </div>
  );
}

/* ================= FEATURES ================= */
function Features() {
  const items = [
    {
      icon: Radar,
      title: "Market Radar",
      text: "Scanner AI yang menemukan saham potensial berdasarkan momentum dan pola harga.",
    },
    {
      icon: Brain,
      title: "AI Scoring",
      text: "Penilaian peluang saham menggunakan algoritma Lintang-GPT proprietary.",
    },
    {
      icon: LineChart,
      title: "Technical + Fundamental",
      text: "Gabungan indikator teknikal dan analisa fundamental otomatis.",
    },
    {
      icon: Activity,
      title: "Sentiment Tracking",
      text: "Analisa sentimen berita dan aktivitas pasar secara real-time.",
    },
    {
      icon: Zap,
      title: "Signal Trading",
      text: "Rekomendasi BUY / HOLD / SELL berbasis probabilitas AI.",
    },
    {
      icon: ShieldCheck,
      title: "Risk-Aware Engine",
      text: "Model AI mempertimbangkan risiko dan volatilitas saham.",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl md:text-4xl font-black">
            Platform Analisa Saham
            <br />
            <span className="text-zinc-500">Berbasis AI</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl border border-zinc-800 bg-[#0b0b0c] hover:border-blue-500/40 transition"
            >
              <f.icon className="w-6 h-6 text-blue-500 mb-4" />
              <h3 className="font-black text-lg">{f.title}</h3>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= PREVIEW ================= */
function Preview() {
  return (
    <section className="py-24 bg-[#070707] border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-black">
            Deteksi Peluang Saham
            <br />
            Lebih Cepat
          </h2>

          <p className="text-zinc-400 mt-6 leading-relaxed">
            Lintang Predator memonitor seluruh saham Bursa Efek Indonesia dan
            mengidentifikasi kandidat terbaik berdasarkan kekuatan tren,
            valuasi, dan sentimen pasar.
          </p>

          <Link
            href="/Market"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold"
          >
            Buka Radar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-blue-600/10 blur-3xl" />
          <div className="relative border border-zinc-800 rounded-3xl p-6 bg-[#0b0b0c]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-black">AI Radar Preview</span>
              <Database className="w-5 h-5 text-blue-500" />
            </div>

            <div className="h-48 rounded-xl bg-gradient-to-br from-blue-600/20 to-transparent border border-zinc-800 flex items-center justify-center text-zinc-500 text-sm">
              Market Visualization
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= CTA ================= */
function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-black">
          Mulai Gunakan AI Stock Radar
        </h2>

        <p className="text-zinc-400 mt-4">
          Deteksi peluang saham Indonesia secara otomatis dengan Lintang
          Predator.
        </p>

        <Link
          href="/Market"
          className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-lg"
        >
          Masuk Market Radar
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

/* ================= PAGE ================= */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Trust />
        <Features />
        <Preview />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
