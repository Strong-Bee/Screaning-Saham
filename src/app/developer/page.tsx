"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Terminal,
  Code2,
  Cpu,
  Globe,
  ShieldCheck,
  Zap,
  ShieldAlert,
  Menu,
  X,
  LayoutDashboard,
  Activity,
} from "lucide-react";

const TEAM = [
  {
    name: "Lintang",
    role: "Lead Architect & Predator Engine Creator",
    specialty: "Quant Analysis & Backend Systems",
    bio: "Dalang di balik algoritma pemindaian market dan integrasi data real-time Google Finance.",
    tech: ["Next.js", "Python", "TradingView Script"],
    color: "from-green-500",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]",
    icon: <Cpu size={32} className="text-green-500" />,
  },
  {
    name: "Gemini 3 Flash",
    role: "AI Co-Architect",
    specialty: "Neural Logic & Frontend Optimization",
    bio: "Bertanggung jawab atas efisiensi UI, sistem pagination, dan logika filter predator.",
    tech: ["Generative AI", "Tailwind CSS", "TypeScript"],
    color: "from-blue-500",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
    icon: <Zap size={32} className="text-blue-500" />,
  },
];

export default function DeveloperPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "radar", label: "Market Radar", icon: LayoutDashboard, href: "/" },
    { id: "signal", label: "Predator Signal", icon: Zap, href: "/" },
    { id: "news", label: "Intel Stream", icon: Activity, href: "/" },
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans relative overflow-hidden selection:bg-green-500 selection:text-black">
      {/* --- NAVBAR (Sama dengan Dashboard) --- */}
      <nav className="sticky top-0 z-[100] w-full border-b border-zinc-800/50 bg-black/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-green-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform">
                <ShieldAlert className="text-black w-6 h-6" />
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">
                LINTANG <span className="text-green-500">PREDATOR</span>
              </h1>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all py-2"
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </Link>
              ))}
              {/* Active State for Dev Arch */}
              <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-green-500 relative py-2">
                <Code2 className="w-4 h-4" /> Dev Arch
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex bg-white text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-green-500 transition-all items-center gap-2 active:scale-95 shadow-xl">
              <ShieldCheck className="w-4 h-4" /> SYSTEM VERIFIED
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-green-500" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAV (Sama dengan Dashboard) */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-24 left-0 w-full bg-[#050505] border-b border-zinc-800 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
            {navItems.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className="flex items-center gap-4 p-5 rounded-[24px] font-black uppercase text-xs bg-zinc-900 text-zinc-500 border border-zinc-800"
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 p-5 rounded-[24px] font-black uppercase text-xs bg-green-500 text-black shadow-lg">
              <Code2 className="w-5 h-5" /> Dev Arch
            </div>
          </div>
        )}
      </nav>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-green-600/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-16 pb-20 relative z-10">
        {/* HEADER SECTION */}
        <div className="mb-24 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <Terminal className="text-green-500 w-5 h-5 animate-pulse" />
            <span className="text-green-500 text-[10px] font-black uppercase tracking-[0.5em]">
              System Dev Access
            </span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-8">
            The{" "}
            <span
              className="text-zinc-900"
              style={{ WebkitTextStroke: "1px #27272a" }}
            >
              Architects
            </span>
          </h1>
          <p className="text-zinc-500 max-w-2xl text-sm md:text-lg leading-relaxed font-medium">
            Membangun infrastruktur cerdas untuk mendominasi pasar modal. Kami
            menggabungkan data scraping presisi tinggi dengan logika neural
            untuk kecepatan eksekusi.
          </p>
        </div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {TEAM.map((member, i) => (
            <div key={i} className="group relative">
              <div
                className={`bg-[#0b0b0c] border border-zinc-800/60 p-8 md:p-12 rounded-[48px] transition-all duration-700 group-hover:border-green-500/30 relative overflow-hidden h-full flex flex-col ${member.glow}`}
              >
                <div
                  className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${member.color} to-transparent opacity-50`}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-5 bg-zinc-900 rounded-[24px] border border-zinc-800 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      {member.icon}
                    </div>
                    <div className="flex gap-3">
                      <SocialLink icon={<Github size={20} />} />
                      <SocialLink icon={<Linkedin size={20} />} />
                    </div>
                  </div>

                  <h3 className="text-4xl font-black italic uppercase mb-2 tracking-tighter">
                    {member.name}
                  </h3>
                  <p
                    className={`bg-clip-text text-transparent bg-gradient-to-r ${member.color} to-white text-[11px] font-black uppercase tracking-[0.2em] mb-8`}
                  >
                    {member.role}
                  </p>

                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-10 italic font-medium">
                    "{member.bio}"
                  </p>

                  <div className="mt-auto pt-8 border-t border-zinc-800/50 space-y-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-600 tracking-widest">
                      <Code2 size={14} /> Technology Stack
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.tech.map((t) => (
                        <span
                          key={t}
                          className="px-5 py-2 bg-black border border-zinc-800 rounded-2xl text-[10px] font-bold text-zinc-400 group-hover:border-zinc-700 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VISION SECTION */}
        <div className="mt-32 p-12 md:p-24 rounded-[70px] bg-gradient-to-b from-zinc-900/30 to-transparent border border-zinc-800/50 text-center relative overflow-hidden">
          <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 text-zinc-800/10" />
          <h4 className="text-3xl md:text-5xl font-black italic uppercase mb-8 relative z-10 leading-tight">
            PUSHING THE BOUNDARIES OF <br />
            <span className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              MARKET INTELLIGENCE
            </span>
          </h4>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed relative z-10">
            Project ini dikembangkan sebagai prototipe sistem trading masa depan
            yang mengedepankan kedaulatan data mentah dan visualisasi intuitif
            bagi para Predator Market.
          </p>
        </div>

        <div className="mt-24 text-center opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600">
            © 2026 Lintang Predator Systems // Core Engine v2.4.0-stable
          </p>
        </div>
      </main>
    </div>
  );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
  return (
    <a
      href="#"
      className="w-12 h-12 flex items-center justify-center rounded-[18px] bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-400 hover:-translate-y-1 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
