"use client";

import React, { useRef, useEffect } from "react";
import Section from "./ui/Section";
import { Users, TrendingUp, Percent, Star } from "lucide-react";
import Image from "next/image";
import AgentNetworkImage from "../public/images/agent-network.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// KOL Feature Card Component
const KOLFeatureCard = ({
  icon: Icon,
  badgeIcon: BadgeIcon,
  title,
  description,
  refCallback,
  className = "",
}: {
  icon: React.ElementType;
  badgeIcon: React.ElementType;
  title: string;
  description: string;
  refCallback?: (el: HTMLDivElement | null) => void;
  className?: string;
}) => (
  <div
    ref={refCallback}
    className={`bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 md:p-6 relative hover:border-orange-500/30 transition-colors ${className}`}
  >
    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center">
      <BadgeIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
    </div>
    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
      <div>
        <h4 className="font-bold text-white text-sm sm:text-base">{title}</h4>
      </div>
    </div>
    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const AgentNetwork = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const networkCardRef = useRef<HTMLDivElement>(null);
  const kolCardRef = useRef<HTMLDivElement>(null);
  const centralCircleRef = useRef<HTMLDivElement>(null);
  const kolItemsRef = useRef<(HTMLDivElement | null)[]>([]);

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
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate network development card
      if (networkCardRef.current) {
        gsap.fromTo(
          networkCardRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: networkCardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate KOL card
      if (kolCardRef.current) {
        gsap.fromTo(
          kolCardRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: kolCardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate central circle with pulse
      if (centralCircleRef.current) {
        gsap.fromTo(
          centralCircleRef.current,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: centralCircleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate KOL feature items
      kolItemsRef.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(
            ref,
            { opacity: 0, y: 30, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              delay: index * 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: kolCardRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={sectionRef} id="network" className="py-12 sm:py-16 md:py-20">
      {/* Header */}
      <div ref={headerRef} className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
          Nhóm Tính năng Phát triển Mạng lưới
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Tự động hóa quy trình quản lý đại lý và tối ưu hóa doanh thu qua mạng lưới KOL.
        </p>
      </div>

      <div className="space-y-8 sm:space-y-12 md:space-y-16">
        {/* Network Development Features */}
        <div 
          ref={networkCardRef} 
          className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl pt-4 sm:pt-6 md:pt-8 overflow-hidden"
        >
          <div className="text-center mb-4 sm:mb-6 md:mb-8 px-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-300 mb-2">
              Dành riêng cho Đại lý Cấp 1
            </h3>
          </div>
          <div className="flex justify-center">
            <Image 
              src={AgentNetworkImage} 
              alt="Agent Network" 
              width={1500} 
              height={1500} 
              className="rounded-xl sm:rounded-2xl w-full max-w-5xl" 
            />
          </div>
        </div>

        {/* KOL Ecosystem */}
        <div 
          ref={kolCardRef} 
          className="relative bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-400 mb-2">
              Hệ sinh thái tiếp thị KOL & Voucher
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Tối ưu hóa doanh thu qua kênh Influencer (Dành riêng Đại lý Cấp 1).
            </p>
          </div>

          {/* Mobile Layout: Stacked */}
          <div className="md:hidden space-y-6">
            {/* Central Circle - Mobile */}
            <div ref={centralCircleRef} className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-400/30 animate-[spin_30s_linear_infinite]"></div>
              <div className="absolute inset-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(251,146,60,0.3)]">
                <Star className="w-6 h-6 text-white mb-1" />
                <h4 className="text-sm font-bold text-white">Thúc đẩy</h4>
                <h4 className="text-sm font-bold text-white">Doanh số</h4>
                <p className="text-[10px] text-orange-100">(Growth Engine)</p>
              </div>
            </div>

            {/* KOL Cards - Mobile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KOLFeatureCard
                icon={Users}
                badgeIcon={Star}
                title="Quản lý KOL"
                description="Tạo và quản lý danh sách đối tác KOL."
                refCallback={(el) => { kolItemsRef.current[0] = el; }}
              />
              <KOLFeatureCard
                icon={Percent}
                badgeIcon={Percent}
                title="Quản lý Voucher"
                description="Cấp voucher khuyến mãi riêng cho từng KOL."
                refCallback={(el) => { kolItemsRef.current[1] = el; }}
              />
              <KOLFeatureCard
                icon={TrendingUp}
                badgeIcon={TrendingUp}
                title="Đơn hàng KOL"
                description="Thống kê doanh số và tính toán hiệu quả từ KOL."
                refCallback={(el) => { kolItemsRef.current[2] = el; }}
              />
            </div>
          </div>

          {/* Desktop Layout: Hub & Spoke */}
          <div className="hidden md:block relative max-w-4xl mx-auto">
            {/* Central Circle - Desktop */}
            <div ref={centralCircleRef} className="relative w-48 lg:w-56 h-48 lg:h-56 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-400/30 animate-[spin_30s_linear_infinite]"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex flex-col items-center justify-center text-center p-2 shadow-[0_0_30px_rgba(251,146,60,0.3)]">
                <Star className="w-8 h-8 text-white mb-2" />
                <h4 className="text-lg font-bold text-white mb-1">Thúc đẩy</h4>
                <h4 className="text-lg font-bold text-white mb-1">Doanh số</h4>
                <p className="text-xs text-orange-100">(Growth Engine)</p>
              </div>
            </div>

            {/* KOL Cards - Desktop Grid */}
            <div className="grid grid-cols-3 gap-6 lg:gap-8">
              <KOLFeatureCard
                icon={Users}
                badgeIcon={Star}
                title="Quản lý KOL"
                description="Tạo và quản lý danh sách đối tác KOL."
                refCallback={(el) => { kolItemsRef.current[0] = el; }}
              />
              <KOLFeatureCard
                icon={Percent}
                badgeIcon={Percent}
                title="Quản lý Voucher"
                description="Cấp voucher khuyến mãi riêng cho từng KOL."
                refCallback={(el) => { kolItemsRef.current[1] = el; }}
              />
              <KOLFeatureCard
                icon={TrendingUp}
                badgeIcon={TrendingUp}
                title="Đơn hàng KOL"
                description="Thống kê doanh số và tính toán hiệu quả từ KOL."
                refCallback={(el) => { kolItemsRef.current[2] = el; }}
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AgentNetwork;
