"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CalendarDays,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock,
} from "lucide-react";

interface TradingViewEvent {
  id: string;
  date: string;
  title: string;
  country: string;
  currency: string;
  impact: number;
  actual: string | null;
  forecast: string | null;
  previous: string | null;
  unit?: string;
}

interface ApiResponse {
  events?: TradingViewEvent[];
  error?: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<TradingViewEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCalendar = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch("/api/calendar", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        throw new Error(`Gagal mengambil data (status: ${res.status})`);
      }

      const data: ApiResponse | TradingViewEvent[] = await res.json();

      if (!Array.isArray(data) && data?.error) {
        throw new Error(data.error);
      }

      const eventList: TradingViewEvent[] = Array.isArray(data)
        ? data
        : (data as ApiResponse).events || [];

      const sorted = [...eventList].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB || a.title.localeCompare(b.title);
      });

      setEvents(sorted);
      setLastUpdated(new Date());
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Terjadi kesalahan tidak diketahui";
      setError(message);
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch pertama kali
  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  // Auto refresh setiap 10 menit (opsional)
  useEffect(() => {
    const interval = setInterval(
      () => {
        fetchCalendar();
      },
      10 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, [fetchCalendar]);

  // ========== TRADINGVIEW ECONOMIC CALENDAR WIDGET LOADER ==========
  useEffect(() => {
    const container = document.getElementById("tradingview-widget-container");
    if (!container) return;

    // Hapus script sebelumnya jika ada
    const existingScript = container.querySelector("script");
    if (existingScript) {
      container.removeChild(existingScript);
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      width: "100%",
      height: "100%",
      importanceFilter: "0,1",
      currencyFilter: "USD,EUR,GBP,JPY,CHF,CAD,AUD,NZD,CNH,IDR",
      isTransparent: false,
      locale: "en",
    });

    container.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      });
    } catch {
      return "--:--";
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      });
    } catch {
      return "-";
    }
  };

  const getImpact = (impact: number) => {
    switch (impact) {
      case 3:
        return {
          label: "HIGH",
          color: "text-red-400 bg-red-500/10 border-red-500/30",
        };
      case 2:
        return {
          label: "MED",
          color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
        };
      case 1:
        return {
          label: "LOW",
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        };
      default:
        return {
          label: "—",
          color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/30",
        };
    }
  };

  const handleRefresh = () => fetchCalendar(true);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 lg:mt-16">
        {/* HEADER */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <CalendarDays className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
              Economic{" "}
              <span className="text-blue-500 underline decoration-blue-600 decoration-4 underline-offset-4">
                Calendar
              </span>
            </h1>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl">
            Pantau rilis data ekonomi global yang berpotensi mempengaruhi pasar
            saham Indonesia secara real-time.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-[2px] bg-blue-600/10 border border-blue-600/20">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              LIVE DATA
            </div>
            <span className="text-zinc-500 text-[10px] font-medium tracking-widest">
              Sumber: TradingView
            </span>
          </div>
        </div>

        {/* TRADINGVIEW ECONOMIC CALENDAR WIDGET */}
        <div className="mb-10">
          <div className="relative border border-zinc-800 rounded-3xl bg-[#0a0a0b] overflow-hidden group hover:border-blue-500/30 transition">
            <div
              id="tradingview-widget-container"
              className="w-full h-[800px]"
            />
            <div className="p-3 border-t border-zinc-800 text-xs text-zinc-500 text-center bg-[#0a0a0b]">
              <a
                href="https://www.tradingview.com/economic-calendar/"
                rel="noopener nofollow"
                target="_blank"
                className="hover:text-blue-400 transition-colors"
              >
                Powered by TradingView
              </a>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-zinc-400">
              {events.length > 0 ? `${events.length} event` : "Tidak ada event"}
            </span>
            {lastUpdated && (
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                <Clock className="w-3 h-3" />
                Updated:{" "}
                {lastUpdated.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold rounded-2xl border border-zinc-800 hover:bg-zinc-900 active:bg-zinc-950 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Memperbarui..." : "Refresh Data"}
          </button>
        </div>

        {/* LOADING STATE */}
        {(loading || refreshing) && events.length === 0 && (
          <div className="flex justify-center items-center py-24">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-sm text-zinc-400">Memuat data kalender...</p>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-red-900/30 bg-red-950/10 rounded-3xl">
            <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
            <p className="text-red-400 font-medium mb-1">Gagal memuat data</p>
            <p className="text-zinc-400 text-sm mb-6 max-w-xs">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-2xl transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-20 border border-zinc-800 rounded-3xl bg-[#0a0a0b]">
            <CalendarDays className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
            <p className="text-lg text-zinc-400">
              Tidak ada event ekonomi dalam periode ini.
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              Coba refresh atau periksa kembali nanti.
            </p>
          </div>
        )}

        {/* TABLE */}
        {!loading && events.length > 0 && (
          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-[#0a0a0b] mb-16 shadow-xl">
            <table className="w-full text-sm">
              <thead className="bg-[#111113]">
                <tr className="text-left text-[10px] uppercase tracking-[1.5px] text-zinc-400 border-b border-zinc-800">
                  <th className="p-4 font-medium">Waktu</th>
                  <th className="p-4 font-medium">Negara</th>
                  <th className="p-4 font-medium">Event</th>
                  <th className="p-4 font-medium text-center">Impact</th>
                  <th className="p-4 font-medium text-right">Actual</th>
                  <th className="p-4 font-medium text-right">Forecast</th>
                  <th className="p-4 font-medium text-right">Previous</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {events.map((event) => {
                  const impact = getImpact(event.impact);
                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-zinc-900/40 transition-colors group"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-mono text-zinc-200 text-[13px]">
                          {formatTime(event.date)}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          {formatDate(event.date)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-zinc-200">
                          {event.country}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {event.currency}
                        </div>
                      </td>
                      <td className="p-4 pr-6 max-w-[320px] text-zinc-300 group-hover:text-white transition-colors">
                        {event.title}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-3 py-px text-[10px] font-bold tracking-wider rounded-full border ${impact.color}`}
                        >
                          {impact.label}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono text-emerald-400 text-[13px]">
                        {event.actual ?? (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono text-zinc-400 text-[13px]">
                        {event.forecast ?? (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono text-zinc-400 text-[13px]">
                        {event.previous ?? (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
