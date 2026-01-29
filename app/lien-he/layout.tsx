import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ TECHERA để được tư vấn giải pháp, đặt lịch demo và nhận báo giá phù hợp cho doanh nghiệp của bạn.",
  alternates: { canonical: "/lien-he" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

