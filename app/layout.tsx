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
  title: "TECHERA | Nền tảng Quản lý & Phân phối Vé Toàn Diện",
  description:
    "TECHERA là nền tảng công nghệ cung cấp giải pháp quản lý, phân phối và bán vé thông minh cho khu du lịch, sự kiện và doanh nghiệp. Tối ưu vận hành, mở rộng mạng lưới đại lý và tăng trưởng doanh thu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
