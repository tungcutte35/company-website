"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { 
  Ticket, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Store,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Button from "@/components/ui/Button";
import Footer from "@/components/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AnimatedCounter = ({ 
  target, 
  suffix = "", 
  prefix = "",
  duration = 2000,
  decimals = 0
}: { 
  target: number; 
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            setCount(easeProgress * target);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
    </span>
  );
};

// Solution Card Component
const SolutionCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features,
  color,
  href
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  features: string[];
  color: string;
  href: string;
}) => (
  <div className="group relative bg-slate-900/80 backdrop-blur rounded-3xl p-8 border border-white/10 hover:border-blue-500/30 transition-all hover:-translate-y-2 overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    
    <div className="relative">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 mb-6 leading-relaxed">{description}</p>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* <Link href={href}> */}
        <Button variant="secondary" className="w-full justify-center cursor-pointer flex gap-1 items-center">
          Tìm hiểu thêm
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      {/* </Link> */}
    </div>
  </div>
);

export default function SolutionsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
        );
      }

      if (solutionsRef.current) {
        gsap.fromTo(
          solutionsRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: solutionsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const solutions = [
    {
      icon: Ticket,
      title: "Quản lý vé du lịch",
      description: "Hệ thống quản lý vé toàn diện cho các điểm du lịch, khu vui chơi và danh lam thắng cảnh.",
      features: [
        "Phát hành vé điện tử QR Code",
        "Quản lý đa loại vé và combo",
        "Tích hợp cổng soát vé tự động",
        "Báo cáo doanh thu real-time"
      ],
      color: "from-blue-500/10 to-transparent",
      // href: "/giai-phap/ve-du-lich"
    },
    {
      icon: Store,
      title: "Mạng lưới đại lý",
      description: "Mở rộng kênh phân phối với hệ thống quản lý đại lý đa cấp thông minh.",
      features: [
        "Quản lý đại lý nhiều cấp",
        "Cấu hình chiết khấu linh hoạt",
        "Chia sẻ doanh thu tự động",
        "Dashboard riêng cho từng đại lý"
      ],
      color: "from-purple-500/10 to-transparent",
      // href: "/giai-phap/mang-luoi-dai-ly"
    },
    {
      icon: Users,
      title: "Quản lý KOL/Affiliate",
      description: "Theo dõi và quản lý hiệu quả chiến dịch marketing qua KOL và affiliate.",
      features: [
        "Tracking link thông minh",
        "Báo cáo hiệu suất chi tiết",
        "Tự động tính hoa hồng",
        "Quản lý nhiều chiến dịch"
      ],
      color: "from-pink-500/10 to-transparent",
      // href: "/giai-phap/kol-affiliate"
    },
    {
      icon: BarChart3,
      title: "Phân tích & Báo cáo",
      description: "Insights mạnh mẽ giúp tối ưu hóa doanh thu và ra quyết định chính xác.",
      features: [
        "Dashboard trực quan",
        "Phân tích xu hướng bán hàng",
        "Dự báo doanh thu AI",
        "Export báo cáo đa định dạng"
      ],
      color: "from-green-500/10 to-transparent",
      // href: "/giai-phap/phan-tich"
    },
    {
      icon: Shield,
      title: "Bảo mật & Phân quyền",
      description: "Hệ thống bảo mật đa lớp với phân quyền chi tiết theo vai trò.",
      features: [
        "Xác thực 2 lớp (2FA)",
        "Phân quyền RBAC",
        "Audit log đầy đủ",
        "Mã hóa dữ liệu end-to-end"
      ],
      color: "from-orange-500/10 to-transparent",
      // href: "/giai-phap/bao-mat"
    },
    {
      icon: Globe,
      title: "API & Tích hợp",
      description: "Kết nối dễ dàng với các hệ thống khác qua RESTful API mạnh mẽ.",
      features: [
        "API documentation đầy đủ",
        "Webhook real-time",
        "SDK đa ngôn ngữ",
        "Sandbox testing environment"
      ],
      color: "from-cyan-500/10 to-transparent",
      // href: "/giai-phap/api-tich-hop"
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar variant="solid" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div ref={heroRef} className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Giải pháp toàn diện</span>
          </div>
          
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.3]">
            Giải pháp công nghệ nâng
            <span className="block pb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              tầm quản lý vận hành
            </span>
          </h1>

          <p className="text-md mb-4 md:text-base text-slate-400 tracking-wide">
            Du lịch · Hàng không · Sự kiện · Bảo tàng · Giải trí
          </p>

          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Techera cung cấp bộ giải pháp toàn diện giúp doanh nghiệp số hóa quy trình, 
            mở rộng kênh phân phối và tối ưu hóa doanh thu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/lien-he">
              <Button variant="primary" className="px-8 py-4 cursor-pointer flex gap-2 items-center">
                Liên hệ tư vấn
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div ref={solutionsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <SolutionCard href={""} key={index} {...solution} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tại sao chọn Techera?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Được tin dùng bởi hàng trăm doanh nghiệp du lịch và giải trí
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                <AnimatedCounter target={99.9} suffix="%" decimals={1} />
              </div>
              <div className="text-slate-400">Uptime hệ thống</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                <AnimatedCounter target={20} suffix="M+" />
              </div>
              <div className="text-slate-400">Vé được xử lý</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-pink-400 mb-2">
                <AnimatedCounter target={50} suffix="+" />
              </div>
              <div className="text-slate-400">Đối tác tin cậy</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl p-10 md:p-16 overflow-hidden bg-slate-900/90 backdrop-blur border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10"></div>
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.06]"></div>

            <div className="relative">
              <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" />

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Sẵn sàng chuyển đổi số?
              </h2>

              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Liên hệ với đội ngũ tư vấn của chúng tôi để được demo và tư vấn giải pháp phù hợp nhất.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/lien-he">
                  <Button className="px-8 py-3 rounded-xl text-gray-800 font-semibold hover:bg-white/90 shadow-lg shadow-cyan-500/20 cursor-pointer">
                    Đặt lịch demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
