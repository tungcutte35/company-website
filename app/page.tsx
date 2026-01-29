import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import HomeHero from "@/components/HomeHero";
import HomeSections from "@/components/HomeSections.client";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "TECHERA là nền tảng quản lý & phân phối vé toàn diện cho khu du lịch, sự kiện và doanh nghiệp. Tối ưu vận hành, mở rộng đại lý, tăng trưởng doanh thu.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden">
      <Navbar variant="transparent" />
      <HomeHero />
      <HomeSections />
      <Footer />
    </div>
  );
}
