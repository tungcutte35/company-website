import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Tìm hiểu về TECHERA: sứ mệnh, tầm nhìn, giá trị cốt lõi và cách chúng tôi giúp doanh nghiệp tối ưu vận hành ngành vé.",
  alternates: { canonical: "/gioi-thieu" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

