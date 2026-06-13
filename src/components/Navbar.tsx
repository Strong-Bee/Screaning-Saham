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
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  Image as ImageIcon,
  ChevronDown,
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

/* ---------- AI MODELS LIST ---------- */
const AI_MODELS = [
  {
    group: "Gemini (Google)",
    models: [
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.1-pro-preview",
      "gemini-3-flash-preview",
      "gemini-3-pro-preview",
      "gemini-2.5-flash-lite-preview-09-2025",
      "gemini-2.5-flash-preview-09-2025",
      "gemini-2.5-flash-lite",
      "gemini-2.5-pro-preview",
      "gemini-2.5-pro-preview-05-06",
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
    ],
  },
  {
    group: "GPT & O-Series (OpenAI)",
    models: [
      "gpt-5.5-pro",
      "gpt-5.5",
      "gpt-5.4-mini",
      "gpt-5.4-nano",
      "gpt-5.4",
      "gpt-5.4-pro",
      "gpt-5.3-chat",
      "gpt-5.2",
      "gpt-5.2-chat",
      "gpt-5.2-pro",
      "gpt-5.1",
      "gpt-5.1-chat-latest",
      "gpt-5.3-codex",
      "gpt-5.2-codex",
      "gpt-5.1-codex",
      "gpt-5.1-codex-mini",
      "gpt-5.1-codex-max",
      "gpt-5-codex",
      "gpt-5",
      "gpt-5-mini",
      "gpt-5-nano",
      "gpt-5-chat-latest",
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4.1-nano",
      "gpt-4.5-preview",
      "gpt-4o",
      "gpt-4o-mini",
      "o1",
      "o1-mini",
      "o1-pro",
      "o3",
      "o3-mini",
      "o4-mini",
    ],
  },
  {
    group: "Claude (Anthropic)",
    models: [
      "claude-fable-5",
      "claude-opus-4.8-fast",
      "claude-opus-4-8",
      "claude-opus-4.7-fast",
      "claude-opus-4-7",
      "claude-opus-4.6-fast",
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-opus-4-5",
      "claude-haiku-4-5",
      "claude-sonnet-4-5",
      "claude-opus-4-1",
      "claude-opus-4",
      "claude-sonnet-4",
    ],
  },
  {
    group: "Grok (xAI)",
    models: [
      "x-ai/grok-build-0.1",
      "x-ai/grok-4.3",
      "x-ai/grok-4.20",
      "x-ai/grok-4.20-multi-agent",
      "x-ai/grok-4-1-fast",
      "x-ai/grok-4-1-fast-non-reasoning",
      "x-ai/grok-code-fast-1",
      "x-ai/grok-4",
      "x-ai/grok-4-fast",
      "x-ai/grok-4-fast-non-reasoning",
      "x-ai/grok-4-0709",
      "x-ai/grok-3",
      "x-ai/grok-3-fast",
      "x-ai/grok-3-mini",
      "x-ai/grok-3-mini-fast",
      "x-ai/grok-2-vision-1212",
      "x-ai/grok-2-image",
      "x-ai/grok-beta",
      "x-ai/grok-vision-beta",
      "x-ai/grok-2",
      "x-ai/grok-2-vision",
    ],
  },
];

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
            description: "Nama kota (contoh: Jakarta, New York)",
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
            description: "Nama kota (contoh: Jakarta, London)",
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
      description: "Dapatkan data pasar IHSG real-time",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_stock_data",
      description:
        "Dapatkan data saham tertentu berdasarkan simbol ticker (contoh: TLKM, BBCA)",
      parameters: {
        type: "object",
        properties: {
          symbol: { type: "string", description: "Simbol saham" },
        },
        required: ["symbol"],
      },
    },
  },
];

/* ---------- MOCK / UTILITY FUNCTIONS ---------- */
function getWeather(location: string) {
  const data: Record<string, { temp: string; condition: string }> = {
    Jakarta: { temp: "32°C", condition: "Cerah berawan" },
    "New York": { temp: "72°F", condition: "Partly cloudy" },
  };
  return data[location] || { temp: "N/A", condition: "Tidak diketahui" };
}

function getCurrentTime(location: string) {
  const times: Record<string, string> = {
    Jakarta: "14:30 WIB",
    London: "7:30 AM GMT",
  };
  return times[location] || "Waktu tidak tersedia";
}

async function getIHSGData() {
  try {
    const res = await fetch("/api/ihsg");
    if (!res.ok) throw new Error("Error");
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
    if (!res.ok) throw new Error("Error");
    return await res.json();
  } catch {
    return { error: `Data ${symbol} tidak ditemukan` };
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
      className="px-3 py-2.5 font-semibold border-b border-zinc-700"
      {...props}
    />
  ),
  td: ({ node, ...props }: any) => (
    <td className="px-3 py-2 border-b border-zinc-800/50" {...props} />
  ),
  p: ({ node, ...props }: any) => (
    <p className="mb-2.5 last:mb-0 leading-relaxed" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc list-outside ml-4 mb-3 space-y-1" {...props} />
  ),
  code: ({ node, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <div className="my-3 overflow-hidden rounded-lg border border-zinc-800 bg-[#050505]">
        <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] font-mono text-zinc-500 uppercase">
          {match[1]}
        </div>
        <div className="overflow-x-auto p-3">
          <code className={`text-[12px] font-mono text-zinc-300`} {...props}>
            {children}
          </code>
        </div>
      </div>
    ) : (
      <code
        className="bg-zinc-800/80 text-blue-300 px-1.5 py-0.5 rounded-md text-[11px] font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },
};

/* ---------- CHAT TYPES ---------- */
interface ChatMessage {
  role: "user" | "assistant";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
  imagePreview?: string;
}

export default function Navbar({ onSync, isLoading }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Chat & Model States
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [toolCallStatus, setToolCallStatus] = useState<string | null>(null);

  // IHSG Ticker
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/Market", label: "Market Radar", icon: LayoutDashboard },
    { href: "/News", label: "News", icon: Activity },
    { href: "/Calendar", label: "Calendar", icon: CalendarDays },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const fetchMiniIHSG = async () => {
      try {
        const res = await fetch("/api/ihsg");
        if (res.ok) {
          const json = await res.json();
          setIhsgData({
            price: json.price,
            change: json.change,
            changePercent: json.changePercent,
            loading: false,
            error: null,
          });
        }
      } catch (err: any) {
        setIhsgData((prev) => ({ ...prev, loading: false, error: "Error" }));
      }
    };
    fetchMiniIHSG();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, streamingContent, toolCallStatus]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  /* ---------- AI FETCH LOGIC DENGAN MULTI-MODEL ---------- */
  const fetchAIResponse = async (history: ChatMessage[]) => {
    setIsChatLoading(true);
    setStreamingContent("");
    setToolCallStatus(null);

    try {
      const formattedHistory = history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const messages: any[] = [
        {
          role: "system",
          content: `Kamu adalah Lintang AI, asisten AI Market Intelligence. Kamu menggunakan model ${selectedModel}. Bantu pengguna dengan analisis teknikal, market, dan bursa efek. Format dengan markdown.`,
        },
        ...formattedHistory,
      ];

      // Panggil API dengan Model yang dipilih User
      const completion = (await puter.ai.chat(messages, {
        model: selectedModel,
        tools: tools,
        stream: false,
      })) as any;

      let finalContent = "";

      if (
        completion.message?.tool_calls &&
        completion.message.tool_calls.length > 0
      ) {
        messages.push(completion.message);
        setToolCallStatus(`🔍 ${selectedModel} mengakses data eksternal...`);

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
            default:
              result = { error: "Fungsi tidak dikenal" };
          }
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          });
        }

        setToolCallStatus(`🧠 ${selectedModel} menganalisis data...`);

        const finalStream = await puter.ai.chat(messages, {
          model: selectedModel,
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
          content: `⚠️ Gagal terhubung ke model ${selectedModel}. Model mungkin belum didukung untuk input ini.`,
        },
      ]);
    } finally {
      setIsChatLoading(false);
      setStreamingContent("");
      setToolCallStatus(null);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() && !selectedImage) return;
    if (isChatLoading) return;

    let contentPayload: any = chatInput.trim();

    if (selectedImage) {
      contentPayload = [];
      if (chatInput.trim())
        contentPayload.push({ type: "text", text: chatInput.trim() });
      contentPayload.push({
        type: "image_url",
        image_url: { url: selectedImage },
      });
    }

    const newMessage: ChatMessage = {
      role: "user",
      content: contentPayload,
      imagePreview: selectedImage || undefined,
    };
    const newHistory = [...chatMessages, newMessage];

    setChatMessages(newHistory);
    setChatInput("");
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    fetchAIResponse(newHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
            <div className="flex items-center gap-6 lg:gap-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative bg-blue-600 p-1.5 rounded-md shadow-[0_0_12px_rgba(37,99,235,0.5)]">
                  <ShieldAlert className="text-white w-5 h-5" />
                </div>
                <span className="text-sm font-black tracking-tight uppercase italic">
                  <strong>
                    LINTANG <span className="text-blue-500">PREDATOR</span>
                  </strong>
                </span>
              </Link>
              <div className="hidden lg:flex items-center gap-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 text-[11px] font-black uppercase transition ${isActive(item.href) ? "text-blue-500" : "text-zinc-500 hover:text-white"}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800">
                <Globe className="w-3 h-3 text-blue-500" />
                <span className="text-zinc-500 font-semibold uppercase text-[10px]">
                  IHSG
                </span>
                {!ihsgData.loading && !ihsgData.error && (
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
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase transition border ${isChatOpen ? "bg-blue-600 border-blue-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-blue-500/50 hover:text-white"}`}
              >
                <MessageSquare className="w-4 h-4" />
                AI Chat
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* CHAT AI PANEL MULTI-MODEL */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsChatOpen(false)}
          />
          <div className="relative w-full max-w-md h-full bg-[#0a0a0b] border-l border-zinc-800 flex flex-col shadow-2xl animate-in slide-in-from-right">
            {/* HEADER CHAT WITH DROPDOWN MODEL */}
            <div className="p-4 border-b border-zinc-800 bg-[#0a0a0b]/80 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-white">
                      Lintang AI
                    </h3>
                    <p className="text-[10px] text-zinc-400">
                      Multi-Model & Multi-Modal
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* DROPDOWN SELECTOR AI */}
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isChatLoading}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-zinc-200 text-[11px] font-mono px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                >
                  {AI_MODELS.map((group) => (
                    <optgroup
                      key={group.group}
                      label={group.group}
                      className="bg-zinc-900 text-blue-400 font-semibold"
                    >
                      {group.models.map((model) => (
                        <option
                          key={model}
                          value={model}
                          className="text-zinc-300 font-normal"
                        >
                          {model}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* MESSAGE CONTAINER */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800">
              {chatMessages.length === 0 &&
                !streamingContent &&
                !toolCallStatus && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 space-y-4">
                    <Bot className="w-12 h-12 text-zinc-700" />
                    <div>
                      <p className="text-sm font-bold text-zinc-400">
                        Pilih Model di Atas
                      </p>
                      <p className="text-xs mt-1 text-zinc-600">
                        Model saat ini:{" "}
                        <span className="text-blue-500">{selectedModel}</span>
                      </p>
                    </div>
                  </div>
                )}

              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-300"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {msg.role === "user" ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3 text-blue-500" />
                      )}
                      <span className="text-[10px] font-bold uppercase text-zinc-500">
                        {msg.role === "user" ? "You" : selectedModel}
                      </span>
                    </div>

                    {msg.role === "user" ? (
                      <div className="space-y-2">
                        {msg.imagePreview && (
                          <img
                            src={msg.imagePreview}
                            alt="Upload"
                            className="max-w-[180px] rounded-lg border border-white/20"
                          />
                        )}
                        <p className="whitespace-pre-wrap">
                          {typeof msg.content === "string"
                            ? msg.content
                            : (msg.content as any[]).find(
                                (c) => c.type === "text",
                              )?.text || ""}
                        </p>
                      </div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={MarkdownComponents}
                      >
                        {msg.content as string}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {streamingContent && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={MarkdownComponents}
                    >
                      {streamingContent}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {toolCallStatus && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-xl border border-zinc-800/60">
                    <Wrench className="w-3 h-3 text-blue-400 animate-spin" />
                    <span>{toolCallStatus}</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* INPUT SECTION */}
            <div className="p-4 border-t border-zinc-800 bg-[#0a0a0b]/90 backdrop-blur-md space-y-3">
              {selectedImage && (
                <div className="relative inline-block p-1 bg-zinc-800 rounded-xl">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isChatLoading}
                  className="p-2 text-zinc-500 hover:text-zinc-200"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Kirim ke ${selectedModel}...`}
                  className="flex-1 bg-transparent border-0 px-2 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none max-h-24 scrollbar-none"
                  rows={1}
                  disabled={isChatLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={
                    (!chatInput.trim() && !selectedImage) || isChatLoading
                  }
                  className="p-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-30"
                >
                  {isChatLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
