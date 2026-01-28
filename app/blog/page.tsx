"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Search,
  Tag,
  TrendingUp,
  BookOpen
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Blog posts data
const blogPosts = [
  {
    id: 1,
    slug: "xu-huong-cong-nghe-du-lich-2024",
    title: "5 xu hướng công nghệ du lịch nổi bật năm 2024",
    excerpt: "Khám phá những công nghệ đang định hình lại ngành du lịch và cách doanh nghiệp có thể tận dụng chúng.",
    image: "/images/blog/tech-trends.jpg",
    category: "Xu hướng",
    author: "Techera Team",
    date: "15/01/2024",
    readTime: "5 phút",
    featured: true,
  },
  {
    id: 2,
    slug: "toi-uu-ban-ve-online",
    title: "Hướng dẫn tối ưu hóa kênh bán vé online",
    excerpt: "Những chiến lược và best practices để tăng tỷ lệ chuyển đổi khi bán vé trực tuyến.",
    image: "/images/blog/online-sales.jpg",
    category: "Hướng dẫn",
    author: "Marketing Team",
    date: "10/01/2024",
    readTime: "8 phút",
    featured: true,
  },
  {
    id: 3,
    slug: "quan-ly-dai-ly-hieu-qua",
    title: "Bí quyết quản lý mạng lưới đại lý hiệu quả",
    excerpt: "Cách xây dựng và duy trì mối quan hệ tốt với hệ thống đại lý phân phối vé.",
    image: "/images/blog/agent-management.jpg",
    category: "Kinh nghiệm",
    author: "Business Team",
    date: "05/01/2024",
    readTime: "6 phút",
    featured: false,
  },
  {
    id: 4,
    slug: "bao-mat-he-thong-ve-dien-tu",
    title: "Đảm bảo an toàn cho hệ thống vé điện tử",
    excerpt: "Các biện pháp bảo mật quan trọng mà mọi hệ thống vé điện tử cần triển khai.",
    image: "/images/blog/security.jpg",
    category: "Bảo mật",
    author: "Tech Team",
    date: "28/12/2023",
    readTime: "7 phút",
    featured: false,
  },
  {
    id: 5,
    slug: "case-study-vinpearl",
    title: "Case Study: Chuyển đổi số tại Vinpearl",
    excerpt: "Câu chuyện thành công trong việc số hóa quy trình quản lý vé tại chuỗi Vinpearl.",
    image: "/images/blog/case-study.jpg",
    category: "Case Study",
    author: "Content Team",
    date: "20/12/2023",
    readTime: "10 phút",
    featured: false,
  },
  {
    id: 6,
    slug: "kol-marketing-nganh-du-lich",
    title: "Tận dụng KOL Marketing trong ngành du lịch",
    excerpt: "Chiến lược hợp tác với influencer để quảng bá điểm đến và tăng doanh số bán vé.",
    image: "/images/blog/kol-marketing.jpg",
    category: "Marketing",
    author: "Marketing Team",
    date: "15/12/2023",
    readTime: "6 phút",
    featured: false,
  },
];

const categories = ["Tất cả", "Xu hướng", "Hướng dẫn", "Kinh nghiệm", "Bảo mật", "Case Study", "Marketing"];

// Blog Card Component
const BlogCard = ({ post, featured = false }: { post: typeof blogPosts[0]; featured?: boolean }) => (
  <Link href={`/blog/${post.slug}`} className="group block">
    <div className={`bg-slate-900/80 backdrop-blur rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all overflow-hidden ${featured ? "md:flex" : ""}`}>
      <div className={`relative ${featured ? "md:w-1/2" : ""} aspect-video bg-slate-800 overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-slate-600" />
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-500/90 text-white text-xs font-medium rounded-full">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className={`p-6 ${featured ? "md:w-1/2 md:flex md:flex-col md:justify-center" : ""}`}>
        <h3 className={`font-bold text-white mb-3 group-hover:text-blue-400 transition-colors ${featured ? "text-2xl" : "text-lg"}`}>
          {post.title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {post.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default function BlogPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar variant="solid" />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-blue-600/5 to-transparent"></div>
        
        <div ref={heroRef} className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Blog & Insights</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.3]">
            Kiến thức & Xu hướng
            <span className="block pb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              ngành vé
            </span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Cập nhật những bài viết mới nhất về xu hướng công nghệ, 
            kinh nghiệm quản lý và best practices trong ngành.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Bài viết nổi bật</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Tất cả bài viết</h2>
          
          {regularPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">Không tìm thấy bài viết phù hợp</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Đăng ký nhận bản tin
          </h2>
          <p className="text-slate-400 mb-8">
            Nhận những bài viết mới nhất và insights hữu ích trực tiếp vào email của bạn.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors cursor-pointer">
              Đăng ký
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
