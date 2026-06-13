import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Parameter url diperlukan" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    // Hapus elemen yang tidak perlu
    $("script, style, noscript, iframe, nav, footer, header, .sidebar, .ad").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();

    // Batasi panjang teks agar tidak terlalu besar
    const maxLength = 6000;
    const truncated = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

    return NextResponse.json({ url, text: truncated });
  } catch (error: any) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal scraping" },
      { status: 500 }
    );
  }
}