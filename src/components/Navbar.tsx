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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { puter } from "@heyputer/puter.js";

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
      name: "get_market_sentiment",
      description:
        "Dapatkan sentimen pasar saham Indonesia (IHSG) secara real-time",
      parameters: {
        type: "object",
        properties: {
          index: {
            type: "string",
            description: "Kode indeks (default: IHSG)",
          },
        },
        required: [],
      },
    },
  },
];

/* ---------- MOCK FUNCTIONS ---------- */
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

function getMarketSentiment(index: string) {
  return {
    index: index || "IHSG",
    sentiment: "Bullish",
    confidence: 0.78,
    last_update: new Date().toISOString(),
  };
}

export default function Navbar({ onSync, isLoading }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [toolCallStatus, setToolCallStatus] = useState<string | null>(null);
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, streamingContent, toolCallStatus]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
    setIsChatLoading(true);
    setStreamingContent("");
    setToolCallStatus(null);

    try {
      const messages = [
        {
          role: "system",
          content:
            "Kamu adalah Lintang AI, asisten AI untuk platform Lintang Predator — AI Market Intelligence untuk Bursa Efek Indonesia. Bantu pengguna memahami saham, analisis teknikal, sentimen pasar, dan data ekonomi. Kamu bisa menggunakan fungsi yang tersedia untuk mendapatkan informasi real-time.",
        },
        ...chatMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: userMessage },
      ];

      const completion = await puter.ai.chat(messages, {
        model: "x-ai/grok-4.3",
        tools: tools,
        stream: false,
      });

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
            case "get_market_sentiment":
              result = getMarketSentiment(args.index || "IHSG");
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
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: finalContent },
        ]);
        setIsChatLoading(false);
        return;
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
                  Sync Engine
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
                    Grok 4.3 • Function Calling
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

            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
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
                        Tanyakan analisis saham, cuaca, atau berita pasar
                        terkini.
                      </p>
                      <div className="mt-3 flex justify-center gap-2 text-xs text-zinc-500">
                        <span className="px-2 py-1 bg-zinc-800 rounded-full">
                          🌤 Cuaca
                        </span>
                        <span className="px-2 py-1 bg-zinc-800 rounded-full">
                          🕒 Waktu
                        </span>
                        <span className="px-2 py-1 bg-zinc-800 rounded-full">
                          📈 Pasar
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-${msg.role === "user" ? "right" : "left"}-2 duration-300`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/20"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-300 shadow-black/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {msg.role === "user" ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3 text-blue-500" />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {msg.role === "user" ? "You" : "Lintang AI"}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
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
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-zinc-900 border border-blue-500/30 text-zinc-300 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-3 h-3 text-blue-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        Lintang AI
                      </span>
                      <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse" />
                    </div>
                    <p className="whitespace-pre-wrap">
                      {streamingContent}
                      <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse" />
                    </p>
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
                  className="flex-1 resize-none bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
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
