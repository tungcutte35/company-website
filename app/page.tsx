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

// JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "TECHERA",
  "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  "description": "TECHERA là nền tảng quản lý & phân phối vé toàn diện cho khu du lịch, sự kiện và doanh nghiệp.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden">
        <Navbar variant="transparent" />
        <main id="main-content" role="main">
          <HomeHero />
          <HomeSections />
        </main>
        <Footer />
      </div>
    </>
  );
}
