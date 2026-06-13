"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Globe,
} from "lucide-react";

export default function IHSGTicker() {
  const [data, setData] = useState<{
    price: number | null;
    change: number | null;
    changePercent: number | null;
    loading: boolean;
    error: string | null;
  }>({
    price: null,
    change: null,
    changePercent: null,
    loading: true,
    error: null,
  });

  const fetchIHSG = async () => {
    try {
      const res = await fetch("/api/ihsg", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData({
        price: json.price,
        change: json.change,
        changePercent: json.changePercent,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err.message,
      }));
    }
  };

  useEffect(() => {
    fetchIHSG();
    const interval = setInterval(fetchIHSG, 60_000);
    return () => clearInterval(interval);
  }, []);

  const formatRupiah = (value: number) =>
    "Rp " +
    value.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatChange = (value: number) =>
    value.toLocaleString("id-ID", {
      signDisplay: "always",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatPercent = (value: number) =>
    value.toLocaleString("id-ID", {
      signDisplay: "always",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + "%";

  const TrendIcon = !data.change
    ? Minus
    : data.change > 0
      ? TrendingUp
      : TrendingDown;
  const trendColor =
    !data.change || data.change === 0
      ? "text-zinc-400"
      : data.change > 0
        ? "text-green-400"
        : "text-red-400";

  return (
    <div className="w-full border-b border-zinc-800/80 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Kiri: Label + Harga */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
              IHSG Real‑time
            </span>
          </div>
          {data.loading ? (
            <div className="h-8 w-40 bg-zinc-800 animate-pulse rounded-lg" />
          ) : data.error ? (
            <span className="text-sm text-red-400 flex items-center gap-1">
              <RefreshCw className="w-4 h-4" /> Gagal memuat
            </span>
          ) : (
            <div className="flex items-baseline gap-3 min-w-0">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white truncate">
                {data.price ? formatRupiah(data.price) : "—"}
              </span>
              {data.change != null && data.changePercent != null && (
                <span
                  className={`text-sm font-bold flex items-center gap-1 whitespace-nowrap ${trendColor}`}
                >
                  <TrendIcon className="w-4 h-4" />
                  {formatChange(data.change)} (
                  {formatPercent(data.changePercent)})
                </span>
              )}
            </div>
          )}
        </div>
        {/* Kanan: Refresh */}
        <button
          onClick={fetchIHSG}
          className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition shrink-0"
          disabled={data.loading}
        >
          <RefreshCw
            className={`w-3 h-3 ${data.loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>
    </div>
  );
}
