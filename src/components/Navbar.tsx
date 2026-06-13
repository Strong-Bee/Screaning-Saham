"use client";

import { useState, useRef, useEffect } from "react";
import {
  ShieldAlert,
  LayoutDashboard,
  Activity,
  Menu,
  X,
  RefreshCw,
  Code2,
  HomeIcon,
  CalendarDays,
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Zap,
  Wrench,
  Pencil,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { puter } from "@heyputer/puter.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NavbarProps {
  onSync?: () => void;
  isLoading?: boolean;
}

/* ---------- TOOLS DEFINITION (Function Calling) ---------- */
const tools = [
  {
    type: "function" as const,
    function: {
      name: "get_weather",
      description: "Dapatkan informasi cuaca terkini untuk suatu kota",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "Nama kota (contoh: Jakarta, New York, Tokyo)",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_current_time",
      description: "Dapatkan waktu saat ini untuk suatu kota",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "Nama kota (contoh: Jakarta, London, Sydney)",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_ihsg_data",
      description:
        "Dapatkan data pasar IHSG real-time: harga terkini, perubahan poin & persentase, high/low, volume, dan previous close.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_stock_data",
      description:
        "Dapatkan data saham tertentu berdasarkan simbol ticker (contoh: TLKM, BBCA) tanpa akhiran .JK. Saham Indonesia otomatis menggunakan IDX.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "Simbol saham (contoh: TLKM, BBCA, ASII)",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "scrape_webpage",
      description:
        "Scrape konten teks dari sebuah halaman web. Gunakan untuk mendapatkan informasi terkini dari berita, artikel, atau halaman publik.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description:
              "URL lengkap halaman yang akan di-scrape (contoh: https://www.cnbcindonesia.com/market/...)",
          },
        },
        required: ["url"],
      },
    },
  },
];

/* ---------- MOCK / UTILITY FUNCTIONS ---------- */
function getWeather(location: string) {
  const data: Record<
    string,
    { temp: string; condition: string; humidity: string }
  > = {
    Jakarta: { temp: "32°C", condition: "Cerah berawan", humidity: "75%" },
    "New York": { temp: "72°F", condition: "Partly cloudy", humidity: "65%" },
    London: { temp: "18°C", condition: "Rainy", humidity: "80%" },
    Tokyo: { temp: "28°C", condition: "Sunny", humidity: "70%" },
  };
  return (
    data[location] || {
      temp: "Tidak diketahui",
      condition: "Data tidak tersedia",
      humidity: "Tidak diketahui",
    }
  );
}

function getCurrentTime(location: string) {
  const times: Record<string, string> = {
    Jakarta: "14:30 WIB",
    "New York": "2:30 AM EST",
    London: "7:30 AM GMT",
    Tokyo: "4:30 PM JST",
  };
  return times[location] || "Waktu tidak tersedia";
}

async function getIHSGData() {
  try {
    const res = await fetch("/api/ihsg");
    if (!res.ok) throw new Error("Gagal mengambil data IHSG");
    return await res.json();
  } catch {
    return { error: "Data IHSG tidak tersedia" };
  }
}

async function getStockData(symbol: string) {
  try {
    const cleanSymbol = symbol.toUpperCase().replace(/\.JK$/i, "");
    const res = await fetch(
      `/api/tradingview/stock?symbol=${encodeURIComponent(cleanSymbol)}`,
    );
    if (!res.ok) throw new Error("Gagal mengambil data saham");
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch {
    return { error: `Data ${symbol} tidak ditemukan` };
  }
}

async function scrapeWebpage(url: string) {
  try {
    const res = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error("Gagal scraping");
    return await res.json();
  } catch {
    return { error: `Gagal mengakses ${url}` };
  }
}

/* ---------- MARKDOWN COMPONENTS ---------- */
const MarkdownComponents: any = {
  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto my-3 rounded-lg border border-zinc-700/50 shadow-sm">
      <table
        className="w-full text-left border-collapse text-xs sm:text-sm"
        {...props}
      />
    </div>
  ),
  thead: ({ node, ...props }: any) => (
    <thead className="bg-zinc-800/80" {...props} />
  ),
  th: ({ node, ...props }: any) => (
    <th
      className="px-3 py-2.5 font-semibold border-b border-zinc-700 text-zinc-200"
      {...props}
    />
  ),
  td: ({ node, ...props }: any) => (
    <td
      className="px-3 py-2 border-b border-zinc-800/50 text-zinc-300"
      {...props}
    />
  ),
  tr: ({ node, ...props }: any) => (
    <tr className="hover:bg-zinc-800/30 transition-colors" {...props} />
  ),
  p: ({ node, ...props }: any) => (
    <p className="mb-2.5 last:mb-0 leading-relaxed" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc list-outside ml-4 mb-3 space-y-1" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal list-outside ml-4 mb-3 space-y-1" {...props} />
  ),
  li: ({ node, ...props }: any) => <li className="pl-1" {...props} />,
  strong: ({ node, ...props }: any) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  a: ({ node, ...props }: any) => (
    <a
      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  code: ({ node, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <div className="my-3 overflow-hidden rounded-lg border border-zinc-800 bg-[#050505]">
        <div className="flex items-center px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase">
          {match[1]}
        </div>
        <div className="overflow-x-auto p-3 scrollbar-thin scrollbar-thumb-zinc-800">
          <code
            className={`text-[12px] font-mono text-zinc-300 ${className || ""}`}
            {...props}
          >
            {children}
          </code>
        </div>
      </div>
    ) : (
      <code
        className="bg-zinc-800/80 text-blue-300 px-1.5 py-0.5 rounded-md text-[11px] font-mono border border-zinc-700/50"
        {...props}
      >
        {children}
      </code>
    );
  },
};

export default function Navbar({ onSync, isLoading }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Chat states
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [toolCallStatus, setToolCallStatus] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editInput, setEditInput] = useState("");

  // IHSG Mini Ticker state
  const [ihsgData, setIhsgData] = useState<{
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

  const chatEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/Market", label: "Market Radar", icon: LayoutDashboard },
    { href: "/News", label: "News", icon: Activity },
    { href: "/Calendar", label: "Calendar", icon: CalendarDays },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Fetch IHSG mini data untuk ticker navbar
  const fetchMiniIHSG = async () => {
    try {
      const res = await fetch("/api/ihsg", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal");
      const json = await res.json();
      setIhsgData({
        price: json.price,
        change: json.change,
        changePercent: json.changePercent,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setIhsgData((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  };

  useEffect(() => {
    fetchMiniIHSG();
    const interval = setInterval(fetchMiniIHSG, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, streamingContent, toolCallStatus, editingIndex]);

  /* ---------- CORE AI FETCH LOGIC ---------- */
  const fetchAIResponse = async (
    history: { role: "user" | "assistant"; content: string }[],
  ) => {
    setIsChatLoading(true);
    setStreamingContent("");
    setToolCallStatus(null);

    try {
      const messages: any[] = [
        {
          role: "system",
          content:
            "Kamu adalah Lintang AI, asisten AI untuk platform Lintang Predator — AI Market Intelligence untuk Bursa Efek Indonesia. Kamu dapat mengakses data pasar real-time (dari TradingView), cuaca, waktu, dan melakukan scraping halaman web untuk mendapatkan berita terkini. Bantu pengguna dengan analisis saham, teknikal, sentimen pasar, dan berita ekonomi. Gunakan format markdown (tabel, list, tebal) agar penjelasanmu rapi. Gunakan fungsi yang tersedia untuk mendapatkan informasi real-time jika diperlukan.",
        },
        ...history,
      ];

      const completion = (await puter.ai.chat(messages, {
        model: "x-ai/grok-4.3",
        tools: tools,
        stream: false,
      })) as any;

      let finalContent = "";

      if (
        completion.message?.tool_calls &&
        completion.message.tool_calls.length > 0
      ) {
        messages.push(completion.message);
        setToolCallStatus("🔍 Mengakses data eksternal...");

        for (const toolCall of completion.message.tool_calls) {
          const args = JSON.parse(toolCall.function.arguments);
          let result: unknown;

          switch (toolCall.function.name) {
            case "get_weather":
              result = getWeather(args.location);
              break;
            case "get_current_time":
              result = getCurrentTime(args.location);
              break;
            case "get_ihsg_data":
              result = await getIHSGData();
              break;
            case "get_stock_data":
              result = await getStockData(args.symbol);
              break;
            case "scrape_webpage":
              result = await scrapeWebpage(args.url);
              break;
            default:
              result = { error: "Fungsi tidak dikenal" };
          }

          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          });
        }

        setToolCallStatus("🧠 Menganalisis data...");

        const finalStream = await puter.ai.chat(messages, {
          model: "x-ai/grok-4.3",
          stream: true,
        });

        setToolCallStatus(null);
        let fullResponse = "";
        for await (const part of finalStream) {
          if (part.text) {
            fullResponse += part.text;
            setStreamingContent(fullResponse);
          }
        }
        finalContent = fullResponse;
      } else {
        finalContent =
          completion.message?.content || "Maaf, tidak ada respons.";
      }

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: finalContent },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Gagal terhubung ke AI. Silakan coba lagi nanti.",
        },
      ]);
    } finally {
      setIsChatLoading(false);
      setStreamingContent("");
      setToolCallStatus(null);
    }
  };

  /* ---------- MESSAGE HANDLERS ---------- */
  const handleSendMessage = () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");

    const newHistory: { role: "user" | "assistant"; content: string }[] = [
      ...chatMessages,
      { role: "user", content: userMessage },
    ];
    setChatMessages(newHistory);
    fetchAIResponse(newHistory);
  };

  const handleSaveEdit = (index: number) => {
    if (!editInput.trim() || isChatLoading) return;
    const newContent = editInput.trim();

    if (newContent === chatMessages[index].content) {
      setEditingIndex(null);
      return;
    }

    setEditingIndex(null);

    const newHistory: { role: "user" | "assistant"; content: string }[] = [
      ...chatMessages.slice(0, index),
      { role: "user", content: newContent },
    ];

    setChatMessages(newHistory);
    fetchAIResponse(newHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mini ticker formatting & colors
  const formatRupiahCompact = (value: number) =>
    "Rp " + value.toLocaleString("id-ID", { maximumFractionDigits: 2 });

  const changeDirection = !ihsgData.change
    ? "netral"
    : ihsgData.change > 0
      ? "up"
      : "down";
  const TrendIcon =
    changeDirection === "up"
      ? TrendingUp
      : changeDirection === "down"
        ? TrendingDown
        : Minus;
  const trendColor =
    changeDirection === "up"
      ? "text-green-400"
      : changeDirection === "down"
        ? "text-red-400"
        : "text-zinc-400";

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 lg:h-20 items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-6 lg:gap-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative bg-blue-600 p-1.5 rounded-md shadow-[0_0_12px_rgba(37,99,235,0.5)] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.8)] transition-shadow">
                  <ShieldAlert className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-300 rounded-full animate-ping" />
                </div>
                <span className="text-sm sm:text-base font-black tracking-tight uppercase italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  <strong>
                    LINTANG <span className="text-blue-500">PREDATOR</span>
                  </strong>
                </span>
              </Link>

              <div className="hidden lg:flex items-center gap-8">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                        active
                          ? "text-blue-500"
                          : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      {active && (
                        <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-blue-300 shadow-[0_0_10px_rgba(37,99,235,0.7)]" />
                      )}
                    </Link>
                  );
                })}

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
              {/* IHSG Mini Ticker */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/30 transition-colors">
                <Globe className="w-3 h-3 text-blue-500" />
                <span className="text-zinc-500 font-semibold uppercase tracking-widest text-[10px]">
                  IHSG
                </span>
                {ihsgData.loading ? (
                  <span className="text-zinc-500 animate-pulse">...</span>
                ) : ihsgData.error ? (
                  <span className="text-red-400 text-[10px]">Error</span>
                ) : (
                  <>
                    <span className="text-white font-bold">
                      {formatRupiahCompact(ihsgData.price!)}
                    </span>
                    <span className={`flex items-center gap-0.5 ${trendColor}`}>
                      <TrendIcon className="w-3 h-3" />
                      {ihsgData.changePercent?.toFixed(2)}%
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`relative hidden sm:flex items-center gap-2 px-4 lg:px-5 py-2 rounded-xl text-[11px] font-black uppercase transition-all duration-300 border ${
                  isChatOpen
                    ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-blue-500/50 hover:text-white hover:shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden lg:inline">AI Chat</span>
                {!isChatOpen && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
              </button>

              {onSync && (
                <button
                  onClick={onSync}
                  disabled={isLoading}
                  className="hidden sm:flex items-center gap-2 px-4 lg:px-6 py-2 rounded-xl bg-blue-600 text-white text-[11px] font-black uppercase hover:bg-blue-500 transition disabled:opacity-40 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  <span className="hidden lg:inline">SYNC</span>
                </button>
              )}

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

              <button
                onClick={() => {
                  setIsChatOpen(true);
                  setIsMenuOpen(false);
                }}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-black uppercase hover:border-blue-500/50 hover:text-white transition"
              >
                <MessageSquare className="w-4 h-4" />
                AI Chat
              </button>

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
                  <span className="hidden lg:inline">Sync Engine</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* CHAT AI PANEL */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setIsChatOpen(false)}
          />
          <div className="relative w-full max-w-md h-full bg-gradient-to-b from-[#0a0a0b] via-[#0a0a0b] to-[#050505] border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-5 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-40 right-10 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl" />
            </div>

            <div className="relative flex items-center justify-between p-5 border-b border-zinc-800 bg-[#0a0a0b]/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                  <Bot className="w-5 h-5 text-white" />
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-300">
                    Lintang AI
                  </h3>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-500" />
                    Grok 4.3 • TradingView + Scraping
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800">
              {chatMessages.length === 0 &&
                !streamingContent &&
                !toolCallStatus && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 space-y-6">
                    <div className="relative">
                      <Bot className="w-16 h-16 text-zinc-700" />
                      <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-black text-zinc-400">
                        Lintang AI Siap Membantu
                      </p>
                      <p className="text-sm mt-2 text-zinc-600">
                        Tanyakan analisis saham, cuaca, berita pasar, atau
                        scraping halaman web!
                      </p>
                      <div className="mt-3 flex justify-center gap-2 text-xs text-zinc-500 flex-wrap">
                        <span className="px-2 py-1 bg-zinc-800 rounded-full cursor-default">
                          📈 IHSG
                        </span>
                        <span className="px-2 py-1 bg-zinc-800 rounded-full cursor-default">
                          🏢 Saham
                        </span>
                        <span className="px-2 py-1 bg-zinc-800 rounded-full cursor-default">
                          🌤 Cuaca
                        </span>
                        <span className="px-2 py-1 bg-zinc-800 rounded-full cursor-default">
                          🌐 Scraping
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  } group animate-in fade-in slide-in-from-${
                    msg.role === "user" ? "right" : "left"
                  }-2 duration-300`}
                >
                  {msg.role === "user" &&
                    editingIndex !== idx &&
                    !isChatLoading && (
                      <button
                        onClick={() => {
                          setEditingIndex(idx);
                          setEditInput(msg.content);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-blue-400 transition-all h-fit mt-1 mr-1"
                        title="Edit Pesan"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg overflow-hidden ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/20"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-300 shadow-black/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {msg.role === "user" ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3 text-blue-500" />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {msg.role === "user" ? "You" : "Lintang AI"}
                      </span>
                    </div>

                    {msg.role === "user" ? (
                      editingIndex === idx ? (
                        <div className="flex flex-col gap-3 min-w-[200px] sm:min-w-[280px]">
                          <textarea
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSaveEdit(idx);
                              }
                            }}
                            className="w-full bg-black/20 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-300 focus:outline-none focus:border-white/50 resize-none"
                            rows={Math.max(2, editInput.split("\n").length)}
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingIndex(null)}
                              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
                              title="Batal"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSaveEdit(idx)}
                              disabled={!editInput.trim() || isChatLoading}
                              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white disabled:opacity-40 transition-colors"
                              title="Simpan & Kirim Ulang"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                      )
                    ) : (
                      <div className="w-full">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={MarkdownComponents}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {toolCallStatus && (
                <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="bg-zinc-900 border border-blue-500/30 rounded-2xl px-4 py-3 text-sm text-zinc-300 flex items-center gap-3">
                    <Wrench className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span>{toolCallStatus}</span>
                  </div>
                </div>
              )}

              {streamingContent && (
                <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-zinc-900 border border-blue-500/30 text-zinc-300 shadow-[0_0_10px_rgba(37,99,235,0.2)] overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-3 h-3 text-blue-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        Lintang AI
                      </span>
                      <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse" />
                    </div>
                    <div className="w-full">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={MarkdownComponents}
                      >
                        {streamingContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {isChatLoading && !streamingContent && !toolCallStatus && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-xs text-zinc-500">Memproses...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="relative p-4 border-t border-zinc-800 bg-[#0a0a0b]/90 backdrop-blur-sm">
              <div className="flex gap-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan..."
                  rows={1}
                  className="flex-1 resize-none bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all scrollbar-thin scrollbar-thumb-zinc-800"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white disabled:opacity-40 transition-all shadow-[0_0_10px_rgba(37,99,235,0.3)] hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
