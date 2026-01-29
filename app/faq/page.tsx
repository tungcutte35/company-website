"use client";

import React, { useRef, useEffect, useState } from "react";
import { 
  ChevronDown, 
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Loader2
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
interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

// FAQ Item Component
const FAQItem = ({ faq, isOpen, onToggle }: { 
  faq: FAQ; 
  isOpen: boolean; 
  onToggle: () => void;
}) => (
  <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors"
    >
      <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
      <ChevronDown 
        className={`w-5 h-5 text-slate-400 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} 
      />
    </button>
    
    {isOpen && (
      <div className="px-6 pb-6">
        <div className="pt-4 border-t border-slate-700">
          <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    )}
  </div>
);

export default function FAQPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== "all") {
          params.append('category', selectedCategory);
        }
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        const data = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
          `/api/faq?${params.toString()}`
        );
        
        if (data.success) {
          setFaqs(data.data.faqs);
          if (data.data.categories) {
            setCategories(["all", ...data.data.categories]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(fetchFAQs, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

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
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent"></div>
        
        <div ref={heroRef} className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Câu hỏi thường gặp</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.3]">
            Giải đáp mọi
            <span className="block pb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              thắc mắc của bạn
            </span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Tìm câu trả lời nhanh chóng cho những câu hỏi phổ biến về sản phẩm và dịch vụ của Techera.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
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
                {category === "all" ? "Tất cả" : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openItems.has(faq.id)}
                  onToggle={() => toggleItem(faq.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">Không tìm thấy câu hỏi phù hợp</p>
            </div>
          )}
        </div>
      </section>

     

      <Footer />
    </div>
  );
}