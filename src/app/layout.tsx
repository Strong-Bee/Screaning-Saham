import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://lintangpredator.com"),

  title: {
    default: "Lintang Predator — AI Stock Radar Indonesia",
    template: "%s | Lintang Predator",
  },

  description:
    "Lintang Predator adalah AI Stock Radar Indonesia untuk screening saham BEI otomatis berbasis RSI dan algoritma Lintang-GPT. Temukan saham potensial real-time.",

  keywords: [
    "stock radar indonesia",
    "screening saham indonesia",
    "stock screener BEI",
    "AI saham indonesia",
    "analisa saham otomatis",
    "RSI saham BEI",
    "alat analisa saham",
    "radar saham",
    "screener saham",
    "saham indonesia",
    "bursa efek indonesia",
  ],

  authors: [{ name: "Lintang Predator Team" }],
  creator: "Lintang Predator",
  publisher: "Lintang Predator",

  category: "finance",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "Lintang Predator — AI Stock Radar Indonesia",
    description:
      "AI Stock Radar Indonesia untuk screening saham BEI otomatis berbasis RSI dan algoritma Lintang-GPT.",
    url: "https://lintangpredator.com",
    siteName: "Lintang Predator",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-lintang-predator.jpg",
        width: 1200,
        height: 630,
        alt: "Lintang Predator Stock Radar",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lintang Predator — AI Stock Radar Indonesia",
    description:
      "AI Stock Radar Indonesia untuk screening saham BEI otomatis berbasis RSI dan algoritma Lintang-GPT.",
    images: ["/og-lintang-predator.jpg"],
  },

  alternates: {
    canonical: "https://lintangpredator.com",
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
    operatingSystem: "Web",
    applicationCategory: "FinanceApplication",
    description:
      "AI Stock Radar Indonesia untuk screening saham BEI otomatis berbasis RSI dan algoritma Lintang-GPT.",
    url: "https://lintangpredator.com",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
    },
    creator: {
      "@type": "Organization",
      name: "Lintang Predator",
    },
  };

  return (
    <html lang="id" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b]`}
      >
        {children}
      </body>
    </html>
  );
}
