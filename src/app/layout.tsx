import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://screaning-saham.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Lintang Predator — AI Stock Radar Indonesia",
    template: "%s | Lintang Predator",
  },

  description:
    "Lintang Predator adalah AI Stock Radar Indonesia untuk screening saham BEI otomatis berbasis RSI dan algoritma Lintang-GPT. Temukan saham potensial real-time di Bursa Efek Indonesia.",

  keywords: [
    "stock radar indonesia",
    "screening saham indonesia",
    "stock screener BEI",
    "AI saham indonesia",
    "analisa saham otomatis",
    "RSI saham BEI",
    "radar saham",
    "screener saham",
    "saham indonesia",
    "bursa efek indonesia",
  ],

  authors: [{ name: "Lintang Predator" }],
  creator: "Lintang Predator",
  publisher: "Lintang Predator",

  category: "finance",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "Lintang Predator — AI Stock Radar Indonesia",
    description:
      "AI Stock Radar Indonesia untuk screening saham BEI otomatis berbasis RSI dan algoritma Lintang-GPT.",
    url: SITE_URL,
    siteName: "Lintang Predator",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-lintang-predator.jpg`,
        width: 1200,
        height: 630,
        alt: "Lintang Predator Stock Radar Indonesia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lintang Predator — AI Stock Radar Indonesia",
    description:
      "AI Stock Radar Indonesia untuk screening saham BEI otomatis berbasis RSI dan Lintang-GPT.",
    images: [`${SITE_URL}/og-lintang-predator.jpg`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lintang Predator",
    url: SITE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "AI Stock Radar Indonesia untuk screening saham Bursa Efek Indonesia otomatis berbasis RSI dan algoritma Lintang-GPT.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
    },
    creator: {
      "@type": "Organization",
      name: "Lintang Predator",
      url: SITE_URL,
    },
  };

  return (
    <html lang="id" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b]`}
      >
        <Script
          id="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
