"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  ArrowLeft,
  ArrowRight,
  Share2,
  Heart,
  Eye,
  Tag,
  User,
  ChevronLeft,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  BookOpen
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/Footer";
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
  content: string;
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

interface RelatedPost {
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
}

interface Navigation {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

// Share Button Component
const ShareButton = ({ icon: Icon, label, onClick, color }: { 
  icon: React.ElementType; 
  label: string; 
  onClick: () => void;
  color: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${color} text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer`}
    title={label}
  >
    <Icon className="w-4 h-4" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

// Related Post Card
const RelatedPostCard = ({ post }: { post: RelatedPost }) => (
  <Link href={`/blog/${post.slug}`} className="group block">
    <div className="bg-slate-900/80 backdrop-blur rounded-xl border border-white/10 hover:border-blue-500/30 transition-all overflow-hidden h-full">
      {/* Image */}
      <div className="relative aspect-video bg-slate-800 overflow-hidden">
        {post.image ? (
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-slate-600" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-500/90 text-white text-xs font-medium rounded-full">
            {post.category}
          </span>
          {post.featured && (
            <span className="px-2 py-1 bg-orange-500/90 text-white text-xs font-medium rounded-full">
              ⭐
            </span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h4 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
          {post.title}
        </h4>
        <p className="text-slate-400 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
        
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.date).toLocaleDateString('vi-VN')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {post.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {post.likes}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <User className="w-3 h-3" />
            <span>{post.author}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-500" />
              <span className="text-xs text-slate-500">
                {post.tags.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </Link>
);

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [navigation, setNavigation] = useState<Navigation>({ prev: null, next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
          `/api/blog/${slug}`
        );
        
        if (!data.success) {
          setError(data.error || 'Không tìm thấy bài viết');
          return;
        }
        
        setPost(data.data.post);
        setRelatedPosts(data.data.relatedPosts);
        setNavigation(data.data.navigation);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải bài viết');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // GSAP Animations
  useEffect(() => {
    if (!post) return;

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
        );
      }
      
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
        );
      }
    });

    return () => ctx.revert();
  }, [post]);

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleShare = (platform: string) => {
    const text = post?.title || '';
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Đã sao chép link!');
        return;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#020617]">
        <Navbar variant="solid" />
        <div className="pt-32 pb-20 px-4 text-center">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Không tìm thấy bài viết</h1>
          <p className="text-slate-400 mb-6">{error || 'Bài viết không tồn tại hoặc đã bị xóa'}</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <ArrowLeft className="w-4 h-4" />
            Quay lại Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar variant="solid" />

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-blue-600/5 to-transparent"></div>
        
        <div ref={heroRef} className="relative max-w-4xl mx-auto">
          {/* Back link */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại Blog
          </Link>

          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="px-4 py-1.5 bg-blue-500/90 text-white text-sm font-medium rounded-full">
              {post.category}
            </span>
            {post.featured && (
              <span className="px-4 py-1.5 bg-orange-500/90 text-white text-sm font-medium rounded-full flex items-center gap-1">
                ⭐ Nổi bật
              </span>
            )}
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('vi-VN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          

          {/* Author & Stats */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              {post.authorAvatar ? (
                <img 
                  src={post.authorAvatar} 
                  alt={post.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <p className="text-white font-medium">{post.author}</p>
                <p className="text-slate-400 text-sm">Tác giả</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-slate-400">
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {post.views.toLocaleString()} lượt xem
              </span>
              {/* <span className="flex items-center gap-2">
                <Heart className={`w-5 h-5 ${liked ? 'text-red-500 fill-red-500' : ''}`} />
                {post.likes + (liked ? 1 : 0)} lượt thích
              </span> */}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-16">
        <div ref={contentRef} className="max-w-4xl mx-auto">
          {/* Article Content */}
          <article
            className="prose prose-invert prose-lg max-w-none mb-12 text-white
              prose-headings:text-white prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-3
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-white prose-p:leading-relaxed
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-ul:text-white prose-li:text-white
              prose-code:text-blue-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700
              prose-blockquote:border-blue-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
              prose-table:text-white
              prose-th:text-white prose-th:bg-slate-800 prose-th:px-4 prose-th:py-2
              prose-td:text-white prose-td:px-4 prose-td:py-2 prose-td:border-slate-700
            "
          >
            <div 
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/\n/g, '<br />')
                  .replace(/^/, '<p>')
                  .replace(/$/, '</p>')
                  .replace(/## (.*?)(<br \/>|<\/p>)/g, '<h2>$1</h2>')
                  .replace(/### (.*?)(<br \/>|<\/p>)/g, '<h3>$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/`(.*?)`/g, '<code>$1</code>')
                  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
              }} 
            />
          </article>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 py-8 border-t border-b border-slate-800">
            <Tag className="w-5 h-5 text-slate-400" />
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          {/* <div className="flex flex-wrap items-center justify-between gap-4 py-8">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                liked 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-400' : ''}`} />
              {liked ? 'Đã thích' : 'Thích bài viết'}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 mr-2 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Chia sẻ:
              </span>
              <ShareButton 
                icon={Facebook} 
                label="Facebook" 
                onClick={() => handleShare('facebook')} 
                color="bg-[#1877f2]" 
              />
              <ShareButton 
                icon={Twitter} 
                label="Twitter" 
                onClick={() => handleShare('twitter')} 
                color="bg-[#1da1f2]" 
              />
              <ShareButton 
                icon={Linkedin} 
                label="LinkedIn" 
                onClick={() => handleShare('linkedin')} 
                color="bg-[#0a66c2]" 
              />
              <ShareButton 
                icon={Link2} 
                label="Copy" 
                onClick={() => handleShare('copy')} 
                color="bg-slate-700" 
              />
            </div>
          </div> */}

          {/* Post Navigation */}
          <div className="grid md:grid-cols-2 gap-4 py-8 border-t border-slate-800">
            {navigation.prev && (
              <Link 
                href={`/blog/${navigation.prev.slug}`}
                className="group p-5 bg-slate-900/80 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all"
              >
                <span className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <ArrowLeft className="w-4 h-4" />
                  Bài trước
                </span>
                <p className="text-white font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                  {navigation.prev.title}
                </p>
              </Link>
            )}
            
            {navigation.next && (
              <Link 
                href={`/blog/${navigation.next.slug}`}
                className="group p-5 bg-slate-900/80 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all md:text-right md:ml-auto"
              >
                <span className="flex items-center justify-end gap-2 text-slate-400 text-sm mb-2">
                  Bài tiếp
                  <ArrowRight className="w-4 h-4" />
                </span>
                <p className="text-white font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                  {navigation.next.title}
                </p>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">Bài viết liên quan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relPost) => (
                <RelatedPostCard key={relPost.id} post={relPost} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Đăng ký nhận bản tin
          </h2>
          <p className="text-slate-400 mb-8">
            Nhận những bài viết mới nhất trực tiếp vào email của bạn.
          </p>
          
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
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
                alert(data.message || data.error);
                if (data.success) form.reset();
              } catch {
                alert('Có lỗi xảy ra!');
              }
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              required
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
