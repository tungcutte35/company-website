"use client";

import React, { useRef, useEffect } from "react";
import Section from "./ui/Section";
import { 
  Printer, 
  Smartphone, 
  QrCode, 
  CloudCog, 
  CheckCircle2, 
  BarChart3, 
  ClipboardList, 
  Ticket,
  Zap,
  Clock,
  Users,
  Globe,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Feature item type
type FeatureItem = {
  icon: React.ElementType;
  title: string;
  desc: string;
};

// Comparison item type
type ComparisonItem = {
  label: string;
  offline: string;
  online: string;
};

const offlineFeatures: FeatureItem[] = [
  {
    icon: Ticket,
    title: "Sản phẩm (Vé Offline)",
    desc: "Xuất vé trực tiếp tại quầy hoặc cổng khu du lịch. Dành cho khách mua lẻ.",
  },
  {
    icon: ClipboardList,
    title: "Danh sách đơn hàng",
    desc: "Theo dõi, tra cứu trạng thái đơn hàng theo thời gian thực.",
  },
  {
    icon: BarChart3,
    title: "Báo cáo xuất vé",
    desc: "Tổng hợp số liệu doanh thu. Đối soát doanh thu cuối ngày và theo ca làm việc.",
  },
];

const onlineFeatures: FeatureItem[] = [
  {
    icon: QrCode,
    title: "Xuất vé Online",
    desc: "Tạo và phát hành vé điện tử (QR Code) thông qua module Khu du lịch. Gửi vé tức thì qua email/tin nhắn.",
  },
  {
    icon: CloudCog,
    title: "Quản lý Đơn hàng Online",
    desc: "Quản lý chi tiết danh sách vé online đã bán. Dữ liệu đồng bộ trực tiếp với tài khoản đại lý.",
  },
  {
    icon: CreditCard,
    title: "Thanh toán không tiền mặt",
    desc: "Tích hợp đa dạng cổng thanh toán: VNPay, Momo, ZaloPay, Banking.",
  },
];

const comparisonData: ComparisonItem[] = [
  { label: "Phương thức", offline: "In vé giấy tại chỗ", online: "Vé điện tử QR Code" },
  { label: "Tốc độ", offline: "Xử lý tức thì", online: "Gửi vé sau 3 giây" },
  { label: "Phạm vi", offline: "Tại quầy/cổng", online: "Mọi nơi, mọi lúc" },
  { label: "Thanh toán", offline: "Tiền mặt/Thẻ", online: "100% Cashless" },
];

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const offlineCardRef = useRef<HTMLDivElement>(null);
  const onlineCardRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate offline card with slide from left
      if (offlineCardRef.current) {
        gsap.fromTo(
          offlineCardRef.current,
          { opacity: 0, x: -60, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: offlineCardRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // Animate feature items inside
        const offlineItems = offlineCardRef.current.querySelectorAll(".feature-item");
        gsap.fromTo(
          offlineItems,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: offlineCardRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate online card with slide from right
      if (onlineCardRef.current) {
        gsap.fromTo(
          onlineCardRef.current,
          { opacity: 0, x: 60, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: onlineCardRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // Animate feature items inside
        const onlineItems = onlineCardRef.current.querySelectorAll(".feature-item");
        gsap.fromTo(
          onlineItems,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: onlineCardRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate comparison table
      if (comparisonRef.current) {
        gsap.fromTo(
          comparisonRef.current,
          { opacity: 0, y: 50, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: comparisonRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // Animate table rows
        const tableRows = comparisonRef.current.querySelectorAll("tbody tr");
        gsap.fromTo(
          tableRows,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: comparisonRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );

        // Animate bottom benefits
        const benefits = comparisonRef.current.querySelectorAll(".benefit-item");
        gsap.fromTo(
          benefits,
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: benefits[0],
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-slate-900/50 py-20">
      <Section id="features">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Tính Năng Bán Hàng Toàn Diện
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Giải pháp linh hoạt cho cả mô hình bán vé Offline tại quầy và Online trực tuyến.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Offline Card */}
          <div ref={offlineCardRef} className="bg-surface border border-white/5 rounded-3xl p-8 hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Printer className="w-6 h-6 text-white" />
              </span>
              <div>
                <h3 className="text-2xl font-bold text-white">Vé Offline</h3>
                <p className="text-sm text-slate-400">Tại quầy / Cổng vào</p>
              </div>
            </div>

            <div className="space-y-4">
              {offlineFeatures.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="feature-item flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/20 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{item.title}</h4>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-orange-400 font-medium text-sm">
                <Zap className="w-4 h-4" />
                Xử lý nhanh chóng tại điểm bán
              </div>
            </div>
          </div>

          {/* Online Card */}
          <div ref={onlineCardRef} className="bg-surface border border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Smartphone className="w-6 h-6 text-white" />
              </span>
              <div>
                <h3 className="text-2xl font-bold text-white">Vé Online</h3>
                <p className="text-sm text-slate-400">Điện tử / Từ xa</p>
              </div>
            </div>

            <div className="space-y-4">
              {onlineFeatures.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="feature-item flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{item.title}</h4>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-blue-400 font-medium text-sm">
                <Globe className="w-4 h-4" />
                Bán vé mọi nơi, mọi lúc
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div ref={comparisonRef} className="bg-surface border border-white/5 rounded-3xl p-8 overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">So Sánh Hiệu Quả</h1>
            <p className="text-sm text-slate-400">Lựa chọn phù hợp với mô hình kinh doanh của bạn</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-left text-slate-400 font-medium text-sm w-1/3"></th>
                  <th className="py-4 px-4 text-center w-1/3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full border border-orange-500/20">
                      <Printer className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 font-bold text-sm">Offline</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center w-1/3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                      <Smartphone className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-bold text-sm">Online</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-slate-300 font-medium">{row.label}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-slate-300 text-sm">{row.offline}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-slate-300 text-sm">{row.online}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Benefits */}
          <div className="mt-8 pt-6 border-t border-white/10 grid md:grid-cols-3 gap-4">
            <div className="benefit-item flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-300">Bảo mật cao</span>
            </div>
            <div className="benefit-item flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-300">Xử lý nhanh chóng</span>
            </div>
            <div className="benefit-item flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-300">Hỗ trợ đa kênh</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Features;

