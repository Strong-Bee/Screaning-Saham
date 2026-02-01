"use client";
import React from "react";
import { TrendingUp, Zap, Target, AlertTriangle } from "lucide-react";

const signals = [
  {
    kode: "BBCA",
    status: "STRONG BUY",
    price: "10.225",
    target: "11.000",
    strength: 95,
  },
  { kode: "GOTO", status: "WATCH", price: "52", target: "64", strength: 40 },
  {
    kode: "TLKM",
    status: "BUY",
    price: "3.850",
    target: "4.200",
    strength: 75,
  },
];

export default function SignalSection() {
  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          Tactical <span className="text-green-500">Signals</span>
        </h2>
        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
          Entry points based on predator algorithm
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {signals.map((sig, i) => (
          <div
            key={i}
            className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-green-500/50 transition-all group"
          >
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div
                className={`p-4 rounded-2xl ${sig.status === "STRONG BUY" ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-400"}`}
              >
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase leading-none">
                  {sig.kode}
                </h3>
                <span
                  className={`text-[10px] font-black tracking-[0.2em] ${sig.status === "STRONG BUY" ? "text-green-500" : "text-zinc-500"}`}
                >
                  {sig.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto border-l border-zinc-800 md:pl-8">
              <div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase">
                  Current Price
                </p>
                <p className="font-black text-white italic">IDR {sig.price}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase">
                  Target Price
                </p>
                <p className="font-black text-green-500 italic">{sig.target}</p>
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] font-bold text-zinc-600 uppercase">
                  Signal Strength
                </p>
                <div className="w-32 h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${sig.strength}%` }}
                  />
                </div>
              </div>
            </div>

            <button className="w-full md:w-auto bg-zinc-800 hover:bg-white hover:text-black px-6 py-3 rounded-xl font-black text-xs uppercase transition-all flex items-center justify-center gap-2">
              <Target className="w-4 h-4" /> Execute Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
