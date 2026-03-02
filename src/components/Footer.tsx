"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#050505] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* GRID */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 p-1.5 rounded-md shadow-[0_0_12px_rgba(37,99,235,0.5)]">
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
              <li>
                <Link
                  href="/"
                  className="text-zinc-500 hover:text-blue-500 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/Market"
                  className="text-zinc-500 hover:text-blue-500 transition"
                >
                  Market Radar
                </Link>
              </li>
              <li>
                <Link
                  href="/Signal"
                  className="text-zinc-500 hover:text-blue-500 transition"
                >
                  Signal
                </Link>
              </li>
              <li>
                <Link
                  href="/News"
                  className="text-zinc-500 hover:text-blue-500 transition"
                >
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider mb-4 text-zinc-400">
              Product
            </h4>

            <ul className="space-y-2 text-sm text-zinc-500">
              <li>AI Stock Screening</li>
              <li>Market Intelligence</li>
              <li>Predator Signals</li>
              <li>Indonesia Stock Radar</li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider mb-4 text-zinc-400">
              Legal
            </h4>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-zinc-500 hover:text-blue-500 transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-zinc-500 hover:text-blue-500 transition"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/Developer"
                  className="text-zinc-500 hover:text-blue-500 transition"
                >
                  Developer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Lintang Predator. All rights reserved.
          </p>

          <div className="text-xs text-zinc-600">
            Built with AI • Indonesia Stock Intelligence
          </div>
        </div>
      </div>
    </footer>
  );
}
