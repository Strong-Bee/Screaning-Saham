import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata untuk Branding Radar Tuan
export const metadata: Metadata = {
  title: "LINTANG PREDATOR | Stock Radar System",
  description:
    "Real-time stock screening tool for Bursa Efek Indonesia using RSI & Lintang-GPT Algorithm.",
  icons: {
    icon: "/favicon.ico", // Pastikan ada favicon di folder public
  },
};

// Viewport khusus agar aplikasi terasa seperti App Mobile (mencegah zoom otomatis saat input)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b]`}
      >
        {children}
      </body>
    </html>
  );
}
