"use client";

import React, { useRef, useEffect } from "react";
import Section from "./ui/Section";
import { TicketCheck, Users, LucideIcon } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Vinpearl from "../public/images/logo-vinpearl.png";
import Sunworld from "../public/images/logo-sunworld.png";
import Vinwonder from "../public/images/logo-vinwonder.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Supplier Card Component
const SupplierCard = ({ 
  image, 
  alt, 
  name, 
  refCallback,
  className = ""
}: { 
  image: StaticImageData; 
  alt: string; 
  name: string; 
  refCallback?: (el: HTMLDivElement | null) => void;
  className?: string;
}) => (
  <div 
    ref={refCallback}
    className={`flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform duration-300 ${className}`}
  >
    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <Image src={image} alt={alt} width={100} height={100} className="px-1 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain" />
    </div>
    <div className="mt-2 md:mt-3 text-center">
      <h3 className="text-white font-bold text-sm sm:text-base md:text-lg group-hover:text-blue-400 transition-colors">
        {name}
      </h3>
      <span className="text-[10px] sm:text-xs text-slate-200 bg-slate-800 px-2 py-0.5 md:py-1 rounded-full border border-slate-700">
        Suppliers
      </span>
    </div>
  </div>
);

// Bottom Node Component
const BottomNode = ({ 
  icon: Icon, 
  name, 
  label, 
  color,
  refCallback,
  className = ""
}: { 
  icon: LucideIcon; 
  name: string; 
  label: string; 
  color: "green" | "orange";
  refCallback?: (el: HTMLDivElement | null) => void;
  className?: string;
}) => {
  const colorClasses = {
    green: {
      border: "border-green-500/30",
      shadow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]",
      hoverShadow: "group-hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]",
      gradient: "from-green-500/10",
      iconColor: "text-green-400",
      hoverText: "group-hover:text-green-400",
    },
    orange: {
      border: "border-orange-500/30",
      shadow: "shadow-[0_0_20px_rgba(249,115,22,0.2)]",
      hoverShadow: "group-hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]",
      gradient: "from-orange-500/10",
      iconColor: "text-orange-400",
      hoverText: "group-hover:text-orange-400"
    }
  };

  const colors = colorClasses[color];

  return (
    <div 
      ref={refCallback}
      className={`flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform duration-300 ${className}`}
    >
      <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-slate-900/80 backdrop-blur-xl ${colors.border} flex items-center justify-center ${colors.shadow} ${colors.hoverShadow} transition-all duration-300 relative overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        <Icon className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 ${colors.iconColor}`} />
      </div>
      <div className="mt-2 md:mt-4 text-center">
        <h3 className={`text-white font-bold text-sm sm:text-base md:text-lg ${colors.hoverText} transition-colors`}>
          {name}
        </h3>
        <span className="text-[10px] sm:text-xs text-slate-200 bg-slate-800 px-2 py-0.5 md:py-1 rounded-full border border-slate-700">
          {label}
        </span>
      </div>
    </div>
  );
};

const Ecosystem = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const supplierRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bottomRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileLayoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate center TECHERA logo with scale and rotation
      if (centerRef.current) {
        gsap.fromTo(
          centerRef.current,
          { opacity: 0, scale: 0, rotation: -180 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.9,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: centerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate suppliers
      supplierRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(
            ref,
            { opacity: 0, y: -40, scale: 0.8 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              delay: index * 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ref,
                start: "top 75%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      // Animate bottom nodes
      bottomRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(
            ref,
            { opacity: 0, y: 40, scale: 0.8 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ref,
                start: "top 65%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      // Animate SVG paths (desktop only)
      const paths = sectionRef.current?.querySelectorAll("svg path");
      if (paths) {
        gsap.fromTo(
          paths,
          { opacity: 0, strokeDashoffset: 100 },
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={sectionRef} id="ecosystem" className="relative py-8 sm:py-12 md:py-16 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

      {/* Header */}
      <div ref={headerRef} className="text-center mb-2 sm:mb-16 md:mb-24 lg:mb-32 relative z-10 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-purple-400">
          Tổng quan Hệ sinh thái Techera
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-light">
          Một nền tảng kết nối thống nhất, nơi mọi luồng dữ liệu đều được đồng bộ hóa tức thì.
        </p>
      </div>

      {/* Mobile Layout (< md) */}
      <div ref={mobileLayoutRef} className="md:hidden flex flex-col items-center gap-6 px-4">
        {/* Suppliers Row */}
        <div className="w-full">
          <p className="text-center text-xs text-blue-400 uppercase tracking-wider mb-4 font-semibold">Suppliers</p>
          <div className="flex justify-center gap-4 sm:gap-6">
            <SupplierCard 
              image={Vinpearl} 
              alt="Vinpearl" 
              name="VINPEARL"
              refCallback={(el) => { supplierRefs.current[0] = el; }}
            />
            <SupplierCard 
              image={Sunworld} 
              alt="Sunworld" 
              name="SUNWORLD"
              refCallback={(el) => { supplierRefs.current[1] = el; }}
            />
            <SupplierCard 
              image={Vinwonder} 
              alt="Vinwonder" 
              name="VINWONDER"
              refCallback={(el) => { supplierRefs.current[2] = el; }}
            />
          </div>
        </div>

        {/* Connector Lines (Mobile) */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500/50 to-purple-500/50"></div>
          <div className="w-3 h-3 rotate-45 border-b-2 border-r-2 border-purple-500/50 -mt-1.5"></div>
        </div>

        {/* Center TECHERA */}
        <div ref={centerRef} className="relative">
          <div className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40">
            <div className="absolute inset-0 rounded-full border border-blue-500/30 border-t-blue-400 animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-3 sm:inset-4 rounded-full border border-purple-500/30 border-b-purple-400 animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 bg-slate-950 rounded-full flex flex-col items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <span className="text-lg sm:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tighter">
                TECHERA
              </span>
              <div className="w-8 sm:w-10 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent my-1"></div>
              <span className="text-[8px] sm:text-[10px] text-blue-200 uppercase tracking-widest">
                Core System
              </span>
            </div>
          </div>
        </div>

        {/* Connector Lines (Mobile) */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rotate-45 border-b-2 border-r-2 border-purple-500/50 mb-1.5"></div>
          <div className="w-0.5 h-6 bg-gradient-to-b from-purple-500/50 to-green-500/50"></div>
        </div>

        {/* Bottom Nodes Row */}
        <div className="w-full">
          <p className="text-center text-xs text-green-400 uppercase tracking-wider mb-4 font-semibold">Distribution</p>
          <div className="flex justify-center gap-8 sm:gap-12">
            <BottomNode 
              icon={Users} 
              name="Đại Lý" 
              label="Agencies" 
              color="green"
              refCallback={(el) => { bottomRefs.current[0] = el; }}
            />
            <BottomNode 
              icon={TicketCheck} 
              name="Hệ Thống Vé" 
              label="Ticket System" 
              color="orange"
              refCallback={(el) => { bottomRefs.current[1] = el; }}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout (>= md) */}
      <div className="hidden md:block relative max-w-5xl mx-auto aspect-[4/3] lg:aspect-[16/9]">
        {/* SVG Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
            </marker>
          </defs>

          {/* Supplier connections */}
          <path d="M 400 60 L 400 140" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash" markerEnd="url(#arrow)" />
          <path d="M 200 60 L 392 145" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash" markerEnd="url(#arrow)" />
          <path d="M 600 65 L 408 145" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash" markerEnd="url(#arrow)" />

          {/* Bottom connections */}
          <path d="M 380 290 L 250 360" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash" markerEnd="url(#arrow)" />
          <path d="M 420 290 L 550 360" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash" markerEnd="url(#arrow)" />

          {/* Inter-node curve */}
          <path d="M 280 380 Q 400 430 520 380" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" fill="none" />
        </svg>

        {/* Center TECHERA Logo */}
        <div ref={centerRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative flex items-center justify-center w-36 h-36 lg:w-48 lg:h-48">
            <div className="absolute inset-0 rounded-full border border-blue-500/30 border-t-blue-400 animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-3 lg:inset-4 rounded-full border border-purple-500/30 border-b-purple-400 animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative z-10 w-24 h-24 lg:w-32 lg:h-32 bg-slate-950 rounded-full flex flex-col items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <span className="text-xl lg:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tighter">
                TECHERA
              </span>
              <div className="w-10 lg:w-12 h-0.5 lg:h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent my-1"></div>
              <span className="text-[9px] lg:text-[10px] text-blue-200 uppercase tracking-widest">
                Core System
              </span>
            </div>
          </div>
        </div>

        {/* Suppliers - Top Row */}
        <div className="absolute -top-10 left-0 right-0 flex justify-between px-8 lg:px-40">
          <SupplierCard 
            image={Vinpearl} 
            alt="Vinpearl" 
            name="VINPEARL"
            refCallback={(el) => { supplierRefs.current[0] = el; }}
          />
          <SupplierCard 
            image={Sunworld} 
            alt="Sunworld" 
            name="SUNWORLD"
            refCallback={(el) => { supplierRefs.current[1] = el; }}
          />
          <SupplierCard 
            image={Vinwonder} 
            alt="Vinwonder" 
            name="VINWONDER"
            refCallback={(el) => { supplierRefs.current[2] = el; }}
          />
        </div>

        {/* Bottom Nodes */}
        <div className="absolute -bottom-10 left-0 right-0 flex justify-between px-16 lg:px-48">
          <BottomNode 
            icon={Users} 
            name="Đại Lý" 
            label="Agencies" 
            color="green"
            refCallback={(el) => { bottomRefs.current[0] = el; }}
          />
          <BottomNode 
            icon={TicketCheck} 
            name="Hệ Thống Vé" 
            label="Ticket System" 
            color="orange"
            refCallback={(el) => { bottomRefs.current[1] = el; }}
          />
        </div>
      </div>
    </Section>
  );
};

export default Ecosystem;

