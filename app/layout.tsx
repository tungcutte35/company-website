import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "TECHERA | Nền tảng Quản lý & Phân phối Vé Toàn Diện",
    template: "%s | TECHERA",
  },
  description:
    "TECHERA là nền tảng công nghệ cung cấp giải pháp quản lý, phân phối và bán vé thông minh cho khu du lịch, sự kiện và doanh nghiệp. Tối ưu vận hành, mở rộng mạng lưới đại lý và tăng trưởng doanh thu.",
  applicationName: "TECHERA",
  alternates: {
    canonical: "/",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
