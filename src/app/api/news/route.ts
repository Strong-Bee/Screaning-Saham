import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";

  // Master Query Logic
  let rawQuery = '("IHSG" OR "saham" OR "emiten" OR "BEI" OR "IDX")';
  if (category === "dividend") rawQuery = '("dividen" OR "cum date" OR "rups") AND saham';
  if (category === "ipo") rawQuery = '("IPO" OR "listing" OR "penawaran umum") AND saham';
  if (category === "macro") rawQuery = '("suku bunga" OR "inflasi" OR "rupiah" OR "ekonomi") AND IHSG';

  try {
    const query = encodeURIComponent(rawQuery);
    const GOOGLE_NEWS_RSS = `https://news.google.com/rss/search?q=${query}&hl=id-ID&gl=ID&ceid=ID:id`;

    const feed = await parser.parseURL(GOOGLE_NEWS_RSS);

    const newsItems = feed.items.map((item) => {
      const titleParts = item.title.split(" - ");
      const sourceName = titleParts.pop() || "Intel";
      const cleanTitle = titleParts.join(" - ");
      const text = cleanTitle.toLowerCase();

      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (/(naik|laba|untung|meroket|dividen|ipo|buyback|bullish)/.test(text)) sentiment = 'positive';
      if (/(turun|rugi|anjlok|drop|bearish|suspen|jatuh|delisting)/.test(text)) sentiment = 'negative';

      return {
        id: item.guid || item.link,
        title: cleanTitle || item.title,
        link: item.link,
        pubDate: item.pubDate,
        source: sourceName,
        sentiment: sentiment
      };
    });

    return NextResponse.json(newsItems.slice(0, 25), {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    return NextResponse.json({ error: "Fail" }, { status: 500 });
  }
}