import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Ambil event dari seminggu ini (Minggu – Sabtu)
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - now.getDay()); // Minggu
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(from.getDate() + 7); // Sabtu berikutnya

    const fromISO = from.toISOString();
    const toISO = to.toISOString();

    // Simbol yang relevan dengan pasar Indonesia dan global
    const symbols = [
      "FX_IDC:USDIDR",
      "FX_IDC:USDJPY",
      "FX_IDC:EURUSD",
      "FX_IDC:GBPUSD",
      "FX_IDC:AUDUSD",
      "FX_IDC:USDCAD",
      "FX_IDC:NZDUSD",
      "FX_IDC:USDCHF",
      "FX_IDC:USDCNH",
      "FX_IDC:USDSGD",
      "FX_IDC:USDHKD",
      "FX_IDC:USDMXN",
      "FX_IDC:USDTRY",
      "FX_IDC:USDZAR",
      "FX_IDC:USDBRL",
      "FX_IDC:USDINR",
    ].join(",");

    const url = `https://economic-calendar.tradingview.com/events?from=${fromISO}&to=${toISO}&symbols=${symbols}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LintangPredatorAI/3.0)",
        "Accept": "application/json",
        "Referer": "https://www.tradingview.com/",
        "Origin": "https://www.tradingview.com",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`TradingView fetch failed: ${res.status}`);
    }

    const data = await res.json();

    // TradingView mengembalikan array event langsung
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (error: any) {
    console.error("Economic Calendar Error:", error.message);
    return NextResponse.json(
      { error: "Gagal mengambil data kalender ekonomi" },
      { status: 500 }
    );
  }
}