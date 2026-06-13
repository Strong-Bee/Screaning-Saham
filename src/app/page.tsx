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
  CalendarDays,
  Globe,
  TrendingUp,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ================= HERO ================= */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6"
          >
            <Radar className="w-4 h-4" />
            AI Stock Radar Indonesia
          </motion.div>

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
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all hover:scale-105 active:scale-95"
            >
              Buka Market Radar
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/Signal"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-blue-500 text-zinc-300 font-bold transition-all hover:scale-105 active:scale-95"
            >
              Lihat Signal AI
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ================= TRUST ================= */
function Trust() {
  const stats = [
    { number: "800+", label: "Saham Dipantau" },
    { number: "24/7", label: "AI Monitoring" },
    { number: "Real-Time", label: "Market Data" },
    { number: "IDX", label: "Fokus Indonesia" },
  ];

  return (
    <section className="border-y border-zinc-900 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, idx) => (
          <Stat key={idx} number={stat.number} label={stat.label} />
        ))}
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="group"
    >
      <div className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">
        {number}
      </div>
      <div className="text-xs uppercase tracking-widest text-zinc-500 mt-2">
        {label}
      </div>
    </motion.div>
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-black">
            Platform Analisa Saham
            <br />
            <span className="text-zinc-500">Berbasis AI</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-3xl border border-zinc-800 bg-[#0b0b0c] hover:border-blue-500/40 transition-all duration-300 group hover:shadow-[0_4px_24px_rgba(59,130,246,0.08)] hover:-translate-y-1"
            >
              <f.icon className="w-6 h-6 text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-black text-lg">{f.title}</h3>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                {f.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= ECONOMIC CALENDAR (EXPANDED) ================= */
function EconomicCalendarSection() {
  const benefits = [
    "Data real-time dari sumber global terpercaya",
    "Filter event berdasarkan dampak & negara",
    "Notifikasi otomatis saat rilis data penting",
    "Integrasi langsung dengan radar saham IDX",
  ];

  return (
    <section className="py-24 bg-[#070707] border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
              <CalendarDays className="w-4 h-4" />
              Economic Calendar
            </div>
            <h2 className="text-3xl md:text-4xl font-black">
              Antisipasi Pergerakan Pasar
              <br />
              <span className="text-zinc-500">dengan Data Ekonomi Global</span>
            </h2>
            <p className="text-zinc-400 mt-6 leading-relaxed">
              Kalender ekonomi terintegrasi menampilkan rilis data penting
              seperti inflasi, suku bunga, GDP, dan indeks manufaktur dari
              seluruh dunia. Pahami potensi dampaknya terhadap saham Indonesia
              sebelum pasar bergerak.
            </p>

            <ul className="mt-8 space-y-3">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-zinc-300">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/Calendar"
              className="inline-flex items-center gap-2 mt-10 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all hover:scale-105 active:scale-95"
            >
              Buka Kalender Ekonomi
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* RIGHT VISUAL */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-3xl" />
            <div className="relative border border-zinc-800 rounded-3xl p-6 bg-[#0b0b0c] overflow-hidden group hover:border-blue-500/30 transition">
              <div className="flex items-center justify-between mb-6">
                <span className="font-black text-sm uppercase tracking-wider">
                  Economic Calendar Preview
                </span>
                <CalendarDays className="w-5 h-5 text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition" />
              </div>

              {/* Mock events */}
              <div className="space-y-4">
                <CalendarEvent
                  time="14:30 WIB"
                  event="US Initial Jobless Claims"
                  impact="high"
                />
                <CalendarEvent
                  time="08:00 WIB"
                  event="Indonesia Trade Balance"
                  impact="medium"
                />
                <CalendarEvent
                  time="15:30 WIB"
                  event="US Crude Oil Inventories"
                  impact="high"
                />
                <CalendarEvent
                  time="09:00 WIB"
                  event="China CPI YoY"
                  impact="medium"
                />
              </div>
              <div className="mt-6 text-center text-xs text-zinc-600">
                Data real-time dari Tradays & MetaTrader
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CalendarEvent({
  time,
  event,
  impact,
}: {
  time: string;
  event: string;
  impact: "high" | "medium" | "low";
}) {
  const impactColor =
    impact === "high"
      ? "text-red-500"
      : impact === "medium"
        ? "text-yellow-500"
        : "text-green-500";

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition">
      <div className="text-xs font-mono text-zinc-500 w-16 shrink-0">
        {time}
      </div>
      <div className="flex-1 text-sm font-medium text-zinc-300 truncate">
        {event}
      </div>
      <div className={`text-xs font-black uppercase ${impactColor}`}>
        {impact === "high" ? "High" : impact === "medium" ? "Med" : "Low"}
      </div>
    </div>
  );
}

/* ================= HOW IT WORKS ================= */
function HowItWorks() {
  const steps = [
    {
      icon: Database,
      title: "Data Aggregation",
      text: "Kami mengumpulkan data harga saham, berita, dan indikator ekonomi secara real-time.",
    },
    {
      icon: Brain,
      title: "AI Processing",
      text: "Algoritma Lintang-GPT menganalisis pola, sentimen, dan valuasi dalam hitungan detik.",
    },
    {
      icon: TrendingUp,
      title: "Signal Generation",
      text: "Platform menghasilkan rekomendasi trading berdasarkan probabilitas keberhasilan.",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black">
            Bagaimana Cara Kerjanya
          </h2>
          <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">
            Proses otomatis dari data mentah hingga sinyal trading yang siap
            digunakan.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300">
                <step.icon className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-black text-lg">{step.title}</h3>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                {step.text}
              </p>
            </motion.div>
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
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
        >
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
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all hover:scale-105 active:scale-95"
          >
            Buka Radar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-blue-600/10 blur-3xl" />
          <div className="relative border border-zinc-800 rounded-3xl p-6 bg-[#0b0b0c] group hover:border-blue-500/30 transition">
            <div className="flex items-center justify-between mb-4">
              <span className="font-black">AI Radar Preview</span>
              <Database className="w-5 h-5 text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition" />
            </div>
            <div className="h-48 rounded-xl bg-gradient-to-br from-blue-600/20 to-transparent border border-zinc-800 flex items-center justify-center text-zinc-500 text-sm group-hover:from-blue-600/30 transition-colors">
              Market Visualization
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= CTA ================= */
function CTA() {
  return (
    <section className="py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center px-4"
      >
        <h2 className="text-3xl md:text-4xl font-black">
          Mulai Gunakan AI Stock Radar
        </h2>
        <p className="text-zinc-400 mt-4">
          Deteksi peluang saham Indonesia secara otomatis dengan Lintang
          Predator.
        </p>
        <Link
          href="/Market"
          className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-lg transition-all hover:scale-105 active:scale-95"
        >
          Masuk Market Radar
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  );
}

/* ================= PAGE ================= */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-blue-500/30">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Trust />
        <Features />
        <EconomicCalendarSection />
        <HowItWorks />
        <Preview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
