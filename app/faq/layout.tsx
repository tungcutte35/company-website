import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Giải đáp nhanh các câu hỏi thường gặp về sản phẩm, tích hợp, bảo mật và quy trình triển khai của TECHERA.",
  alternates: { canonical: "/faq" },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}

