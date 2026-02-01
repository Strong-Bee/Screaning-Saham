import { NextResponse } from "next/server";
import Parser from "rss-parser";

// Tambahkan header custom agar Google tidak memblokir request kita
const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";

    // Master Query Logic
    let rawQuery = '("IHSG" OR "saham" OR "emiten" OR "BEI" OR "IDX")';
    if (category === "dividend") rawQuery = '("dividen" OR "cum date" OR "rups") AND saham';
    if (category === "ipo") rawQuery = '("IPO" OR "listing" OR "penawaran umum") AND saham';
    if (category === "macro") rawQuery = '("suku bunga" OR "inflasi" OR "rupiah" OR "ekonomi") AND IHSG';

    const query = encodeURIComponent(rawQuery);
    const GOOGLE_NEWS_RSS = `https://news.google.com/rss/search?q=${query}&hl=id-ID&gl=ID&ceid=ID:id`;

    // Ambil data dengan timeout agar tidak menggantung jika koneksi lambat
    const feed = await parser.parseURL(GOOGLE_NEWS_RSS);

    if (!feed.items) {
      return NextResponse.json([], { status: 200 });
    }

    const newsItems = feed.items.map((item) => {
      // Split judul untuk memisahkan Nama Sumber
      const titleParts = (item.title || "").split(" - ");
      const sourceName = titleParts.length > 1 ? titleParts.pop() : "Market Intel";
      const cleanTitle = titleParts.join(" - ");
      const text = cleanTitle.toLowerCase();

      // Sentiment Logic
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (/(naik|laba|untung|meroket|dividen|ipo|buyback|bullish|cuan)/.test(text)) sentiment = 'positive';
      else if (/(turun|rugi|anjlok|drop|bearish|suspen|jatuh|delisting|boncos)/.test(text)) sentiment = 'negative';

      return {
        id: item.guid || item.link || Math.random().toString(),
        title: cleanTitle || item.title,
        link: item.link,
        pubDate: item.pubDate,
        source: sourceName,
        sentiment: sentiment
      };
    });

    // Urutkan berdasarkan tanggal terbaru (Double check sorting)
    const sortedNews = newsItems.sort((a, b) => 
      new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
    );

    return NextResponse.json(sortedNews.slice(0, 1000), {
      status: 200,
      headers: { 
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    console.error("Critical Scraper Error:", error.message);
    return NextResponse.json(
      { error: "Fail", message: "Gagal menembus pertahanan Google News" }, 
      { status: 500 }
    );
  }
}