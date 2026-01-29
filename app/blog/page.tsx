"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Search,
  TrendingUp,
  BookOpen,
  Loader2,
  Eye,
  Heart,
  User,
  Tag
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { fetchJsonCached } from "@/lib/clientFetch";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Types
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  category: string;
  author: string;
  authorAvatar: string | null;
  date: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

// Blog Card Component
const BlogCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => (
  <Link href={`/blog/${post.slug}`} className="group block h-full">
    <div className={`h-full bg-slate-900/80 backdrop-blur rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all overflow-hidden ${featured ? "md:flex" : "flex flex-col"}`}>
      <div className={`relative ${featured ? "md:w-1/2" : ""} ${featured ? "md:h-full" : ""} aspect-video bg-slate-800 overflow-hidden shrink-0`}>
        {post.image ? (
          <Image 
            src={post.image} 
            alt={post.title}
            className="object-cover w-full h-full"
            width={500}
            height={500}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-slate-600" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-500/90 text-white text-xs font-medium rounded-full">
            {post.category}
          </span>
          {post.featured && (
            <span className="px-3 py-1 bg-orange-500/90 text-white text-xs font-medium rounded-full flex items-center gap-1">
              ⭐ Nổi bật
            </span>
          )}
        </div>
      </div>
      
      <div className={`p-6 flex flex-col ${featured ? "md:w-1/2" : "flex-1"}`}>
        <h3 className={`font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-4 ${featured ? "text-2xl" : "text-lg"}`}>
          {post.title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(post.date).toLocaleDateString('vi-VN')}
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {post.views.toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {post.likes}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-500" />
              <span className="text-xs text-slate-500">
                {post.tags.length} tag{post.tags.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </Link>
);

export default function BlogPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tất cả"]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== "Tất cả") {
          params.append('category', selectedCategory);
        }
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        const data = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
          `/api/blog?${params.toString()}`
        );
        
        if (data.success) {
          setPosts(data.data.posts);
          if (data.data.categories) {
            setCategories(data.data.categories);
          }
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(fetchPosts, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  // Newsletter subscription
  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribing(true);
    setSubscribeMessage(null);
    
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    
    try {
      const data = await fetchJsonCached<{ success: boolean; message?: string; error?: string }>(
        "/api/newsletter",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      
      if (data.success) {
        setSubscribeMessage({ type: 'success', text: data.message || 'Đăng ký thành công!' });
        form.reset();
      } else {
        setSubscribeMessage({ type: 'error', text: data.error || 'Có lỗi xảy ra!' });
      }
    } catch {
      setSubscribeMessage({ type: 'error', text: 'Có lỗi xảy ra!' });
    } finally {
      setSubscribing(false);
    }
  };

  const filteredPosts = posts;
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Featured Posts */}
      {!loading && featuredPosts.length > 0 && (
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
      {!loading && (
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
      )}

      {/* Newsletter CTA */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Đăng ký nhận bản tin
          </h2>
          <p className="text-slate-400 mb-8">
            Nhận những bài viết mới nhất và insights hữu ích trực tiếp vào email của bạn.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              required
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit"
              disabled={subscribing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {subscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {subscribing ? 'Đang gửi...' : 'Đăng ký'}
            </button>
          </form>
          
          {subscribeMessage && (
            <p className={`mt-4 text-sm ${subscribeMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {subscribeMessage.text}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
