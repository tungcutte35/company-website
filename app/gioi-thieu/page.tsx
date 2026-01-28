"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { 
  Target, 
  Eye, 
  Heart, 
  Sparkles, 
  Users, 
  Award, 
  ArrowRight,
  CheckCircle2,
  Building2,
  Zap
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Button from "@/components/ui/Button";
import Footer from "@/components/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Animated Counter Component
const AnimatedCounter = ({ 
  end, 
  suffix = "", 
  prefix = "",
  duration = 2000 
}: { 
  end: number; 
  suffix?: string; 
  prefix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            const startTime = Date.now();
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Easing function for smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const currentCount = Math.floor(easeOutQuart * end);
              
              setCount(currentCount);
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(end);
              }
            };
            
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div ref={counterRef} className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};

// Stats Card Component with Count-up Animation
const StatCard = ({ number, label }: { number: string; label: string }) => {
  // Parse the number string to extract numeric value and suffix
  const parseNumber = (str: string): { value: number; suffix: string; prefix: string } => {
    const match = str.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
    if (match) {
      return {
        prefix: match[1] || "",
        value: parseFloat(match[2]),
        suffix: match[3] || ""
      };
    }
    return { prefix: "", value: 0, suffix: str };
  };

  const { value, suffix, prefix } = parseNumber(number);

  return (
    <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-blue-500/30 transition-colors">
      <AnimatedCounter end={value} suffix={suffix} prefix={prefix} duration={2000} />
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
};

// Value Card Component
const ValueCard = ({ 
  icon: Icon, 
  title, 
  description,
  color
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  color: string;
}) => (
  <div className="group p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all hover:-translate-y-1">
    <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

// Timeline Item Component
const TimelineItem = ({ 
  year, 
  title, 
  description,
  isLast = false
}: { 
  year: string; 
  title: string; 
  description: string;
  isLast?: boolean;
}) => (
  <div className="relative pl-8 pb-8">
    {!isLast && (
      <div className="absolute left-[11px] top-8 w-0.5 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
    )}
    <div className="absolute left-0 top-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
      <div className="w-2 h-2 bg-white rounded-full"></div>
    </div>
    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
      <span className="text-blue-400 font-bold text-sm">{year}</span>
      <h4 className="text-white font-bold mt-1 mb-2">{title}</h4>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  </div>
);

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
        );
      }

      // Stats animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Values animation
      if (valuesRef.current) {
        gsap.fromTo(
          valuesRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: valuesRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Navigation */}
      <Navbar variant="solid" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div ref={heroRef} className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Về Techera</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.3]">
            Đổi mới công nghệ
            <span className="block pb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Phân phối vé thông minh
            </span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Techera là nền tảng công nghệ hàng đầu Việt Nam trong lĩnh vực quản lý và phân phối vé du lịch, 
            sự kiện và giải trí, mang đến giải pháp toàn diện cho doanh nghiệp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 ">
            <Button variant="primary" className="px-6 py-4 flex items-center gap-2 cursor-pointer">
              Tìm hiểu thêm
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link href="/tuyen-dung">
              <Button variant="secondary" className="px-8 py-3 cursor-pointer">
                Gia nhập đội ngũ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div ref={statsRef} className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard number="50+" label="Đối tác kinh doanh" />
          <StatCard number="20M+" label="Vé được phân phối" />
          <StatCard number="30+" label="Nhân sự chuyên nghiệp" />
          <StatCard number="99.9%" label="Uptime hệ thống" />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="relative bg-slate-900/80 backdrop-blur rounded-3xl p-8 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent"></div>

              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
                <Target className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">Sứ mệnh</h2>
              <p className="text-slate-300 leading-relaxed">
                Cung cấp giải pháp công nghệ tiên tiến, giúp doanh nghiệp du lịch và giải trí 
                tối ưu hóa quy trình kinh doanh, nâng cao trải nghiệm khách hàng và thúc đẩy 
                tăng trưởng bền vững.
              </p>
            </div>

            {/* Vision */}
            <div className="relative bg-slate-900/80 backdrop-blur rounded-3xl p-8 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent"></div>

              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                <Eye className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">Tầm nhìn</h2>
              <p className="text-slate-300 leading-relaxed">
                Trở thành nền tảng quản lý và phân phối vé số 1 Đông Nam Á, 
                kết nối hàng triệu người dùng với những trải nghiệm du lịch 
                và giải trí tuyệt vời nhất.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* Core Values */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div ref={valuesRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon={Zap}
              title="Đổi mới"
              description="Không ngừng sáng tạo và áp dụng công nghệ mới nhất."
              color="bg-gradient-to-br from-yellow-500 to-orange-500"
            />
            <ValueCard
              icon={Heart}
              title="Tận tâm"
              description="Đặt khách hàng làm trung tâm trong mọi quyết định."
              color="bg-gradient-to-br from-pink-500 to-red-500"
            />
            <ValueCard
              icon={Award}
              title="Chất lượng"
              description="Cam kết cung cấp sản phẩm và dịch vụ xuất sắc."
              color="bg-gradient-to-br from-blue-500 to-cyan-500"
            />
            <ValueCard
              icon={Users}
              title="Hợp tác"
              description="Xây dựng mối quan hệ đối tác bền vững và tin cậy."
              color="bg-gradient-to-br from-green-500 to-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      {/* <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-slate-400">Những cột mốc quan trọng của Techera</p>
          </div>

          <div className="mt-12">
            <TimelineItem
              year="2020"
              title="Thành lập Techera"
              description="Ra đời với sứ mệnh số hóa ngành vé du lịch và giải trí Việt Nam."
            />
            <TimelineItem
              year="2021"
              title="Ra mắt nền tảng v1.0"
              description="Phiên bản đầu tiên phục vụ hơn 50 đối tác trong năm đầu hoạt động."
            />
            <TimelineItem
              year="2022"
              title="Mở rộng quy mô"
              description="Đạt 200+ đối tác, xử lý hơn 500,000 giao dịch vé mỗi tháng."
            />
            <TimelineItem
              year="2023"
              title="Nâng cấp công nghệ"
              description="Ra mắt phiên bản 2.0 với AI và tự động hóa quy trình."
            />
            <TimelineItem
              year="2024"
              title="Vươn tầm khu vực"
              description="Mở rộng thị trường sang các nước Đông Nam Á."
              isLast
            />
          </div>
        </div>
      </section> */}

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-[#020617]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tại sao chọn Techera?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Nền tảng công nghệ hiện đại, bảo mật cao",
              "Đội ngũ hỗ trợ chuyên nghiệp 24/7",
              "Tích hợp đa kênh bán hàng",
              "Báo cáo và phân tích chi tiết theo thời gian thực",
              "Chi phí hợp lý, ROI cao",
              "Đối tác tin cậy của các thương hiệu lớn",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700">
                <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                <span className="text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl p-10 md:p-16 overflow-hidden
            bg-slate-900/90 backdrop-blur
            border border-white/10">

            {/* subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10"></div>

            {/* grid */}
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.06]"></div>

            <div className="relative">
              <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" />

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Sẵn sàng trải nghiệm?
              </h2>

              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Liên hệ với chúng tôi ngay hôm nay để được tư vấn giải pháp phù hợp nhất cho doanh nghiệp của bạn.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  className="px-8 py-3 rounded-xl
                     text-gray-800 font-semibold
                    hover:bg-white/90 hover:text-gray-900
                    shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Liên hệ tư vấn
                </Button>

                <Link href="/tuyen-dung">
                  <Button
                    variant="secondary"
                    className="px-8 py-3 rounded-xl
                      border border-white/20 text-white
                      hover:bg-white/10 cursor-pointer"
                  >
                    Xem vị trí tuyển dụng
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
