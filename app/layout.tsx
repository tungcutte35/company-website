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

// Production check removed - allowing indexing for Lighthouse testing

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "TECHERA | Nền tảng Quản lý & Phân phối Vé Toàn Diện",
    template: "%s | TECHERA",
  },
  description:
    "TECHERA là nền tảng công nghệ cung cấp giải pháp quản lý, phân phối và bán vé thông minh cho khu du lịch, sự kiện và doanh nghiệp. Tối ưu vận hành, mở rộng mạng lưới đại lý và tăng trưởng doanh thu.",
  applicationName: "TECHERA",
  // NOTE: Temporarily allowing indexing for Lighthouse testing
  // In production, this should check VERCEL_ENV === 'production'
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      'vi': '/',
      'en': '/en',
    },
  },
  openGraph: {
    type: "website",
    siteName: "TECHERA",
    title: "TECHERA | Nền tảng Quản lý & Phân phối Vé Toàn Diện",
    description:
      "TECHERA là nền tảng công nghệ cung cấp giải pháp quản lý, phân phối và bán vé thông minh cho khu du lịch, sự kiện và doanh nghiệp.",
    url: "/",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TECHERA | Nền tảng Quản lý & Phân phối Vé Toàn Diện",
    description:
      "TECHERA là nền tảng công nghệ cung cấp giải pháp quản lý, phân phối và bán vé thông minh cho khu du lịch, sự kiện và doanh nghiệp.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preload" href="/images/logo.jpg" as="image" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
