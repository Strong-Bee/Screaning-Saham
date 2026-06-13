"use client";

import Link from "next/link";
import { ShieldAlert, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#050505] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* GRID */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 group">
              <div className="bg-blue-600 p-1.5 rounded-md shadow-[0_0_12px_rgba(37,99,235,0.5)] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.7)] transition-shadow">
                <ShieldAlert className="text-white w-5 h-5" />
              </div>
              <span className="font-black uppercase italic tracking-tight">
                LINTANG <span className="text-blue-500">PREDATOR</span>
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              AI Stock Radar Indonesia untuk screening saham Bursa Efek
              Indonesia berbasis algoritma Lintang-GPT.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider mb-4 text-zinc-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/Market", label: "Market Radar" },
                { href: "/News", label: "News" },
                { href: "/Calendar", label: "Calendar" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-zinc-500 hover:text-blue-500 transition flex items-center gap-1 group"
                  >
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider mb-4 text-zinc-400">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              {[
                "AI Stock Screening",
                "Market Intelligence",
                "Predator Signals",
                "Indonesia Stock Radar",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-blue-400 transition cursor-default"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider mb-4 text-zinc-400">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/Developer", label: "Developer" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-zinc-500 hover:text-blue-500 transition flex items-center gap-1 group"
                  >
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Lintang Predator. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Built with AI • Indonesia Stock Intelligence
          </div>
        </div>
      </div>
    </footer>
  );
}
