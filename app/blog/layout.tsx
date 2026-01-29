import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Cập nhật bài viết mới nhất về xu hướng công nghệ, kinh nghiệm quản lý và best practices trong ngành vé.",
  alternates: { canonical: "/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

