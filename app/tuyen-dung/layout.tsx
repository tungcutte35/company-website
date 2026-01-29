import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tuyển dụng",
  description:
    "Cơ hội nghề nghiệp tại TECHERA. Khám phá các vị trí đang tuyển và gia nhập đội ngũ xây dựng nền tảng ticketing hiện đại.",
  alternates: { canonical: "/tuyen-dung" },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}

