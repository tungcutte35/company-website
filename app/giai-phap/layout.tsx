import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giải pháp",
  description:
    "Khám phá bộ giải pháp TECHERA giúp số hoá quy trình bán vé, quản lý đại lý, KOL/Affiliate và báo cáo doanh thu real-time.",
  alternates: { canonical: "/giai-phap" },
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

