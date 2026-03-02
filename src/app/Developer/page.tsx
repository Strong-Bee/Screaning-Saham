"use client";

import { useState } from "react";
import {
  ShieldAlert,
  LayoutDashboard,
  Zap,
  Activity,
  Menu,
  X,
  RefreshCw,
  Code2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  onSync?: () => void;
  isLoading?: boolean;
}

export default function Navbar({ onSync, isLoading }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/Market", label: "Market Radar", icon: LayoutDashboard },
    { href: "/Signal", label: "Signal", icon: Zap },
    { href: "/News", label: "News", icon: Activity },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-[#050505]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ROW */}
        <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-6 lg:gap-10">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-blue-600 p-1.5 rounded-md shadow-[0_0_12px_rgba(37,99,235,0.5)]">
                <ShieldAlert className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <span className="text-sm sm:text-base font-black tracking-tight uppercase italic">
                LINTANG <span className="text-blue-500">PREDATOR</span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition ${
                      active
                        ? "text-blue-500"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}

                    {active && (
                      <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.7)]" />
                    )}
                  </Link>
                );
              })}

              {/* DEV */}
              <Link
                href="/Developer"
                className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition ${
                  pathname.startsWith("/Developer")
                    ? "text-blue-500"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                <Code2 className="w-4 h-4" />
                Developer
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* SYNC */}
            {onSync && (
              <button
                onClick={onSync}
                disabled={isLoading}
                className="hidden sm:flex items-center gap-2 px-4 lg:px-6 py-2 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase hover:bg-blue-500 transition disabled:opacity-40"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden lg:inline">SYNC</span>
              </button>
            )}

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-blue-500" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-[#050505]">
          <div className="px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/Developer"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase transition ${
                pathname.startsWith("/Developer")
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800"
              }`}
            >
              <Code2 className="w-4 h-4" />
              Developer
            </Link>

            {/* MOBILE SYNC */}
            {onSync && (
              <button
                onClick={() => {
                  onSync();
                  setIsMenuOpen(false);
                }}
                disabled={isLoading}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white text-xs font-black uppercase disabled:opacity-40"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Sync Engine
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
