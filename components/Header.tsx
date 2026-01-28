"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./ui/Button";
import HeroBg from "@/public/images/hero-img.webp";
import Logo from "@/public/images/logo.jpg";
import { ArrowDown, ChevronDown, Building2, Users } from "lucide-react";
import gsap from "gsap";

// Dropdown Menu Component
const DropdownMenu = ({ 
  label, 
  items, 
  isScrolled 
}: { 
  label: string; 
  items: { label: string; href: string; icon: React.ReactNode; description: string }[];
  isScrolled: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`flex items-center gap-1 transition-colors font-semibold ${
          isScrolled 
            ? "text-slate-600 hover:text-blue-600" 
            : "text-slate-200 hover:text-blue-400 drop-shadow-sm"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Panel */}
      <div className={`absolute top-full left-0 pt-2 transition-all duration-200 ${isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-1  min-w-[230px]">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <div>
                <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {item.label}
                </div>
                <div className="text-sm text-slate-500">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // GSAP Refs
  const heroContentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Company dropdown items
  const companyDropdownItems = [
    {
      label: "Giới thiệu",
      href: "/gioi-thieu",
      icon: <Building2 className="w-5 h-5" />,
      description: "Tìm hiểu về Techera",
    },
    {
      label: "Tuyển dụng",
      href: "/tuyen-dung",
      icon: <Users className="w-5 h-5" />,
      description: "Cơ hội nghề nghiệp",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Hero Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for hero content
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Animate navigation
      if (navRef.current) {
        gsap.set(navRef.current, { opacity: 0, y: -30 });
        tl.to(navRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        }, 0);
      }

      // Animate hero content children
      if (heroContentRef.current) {
        const children = heroContentRef.current.children;
        gsap.set(children, { opacity: 0, y: 60, scale: 0.98 });
        
        tl.to(children, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        }, 0.3);
      }

      // Animate arrow with delay
      if (arrowRef.current) {
        gsap.set(arrowRef.current, { opacity: 0, y: -20 });
        tl.to(arrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
        }, 1.2);
      }
    });

    return () => ctx.revert();
  }, []);

 
  const parallaxOffset = scrollY * 0.1;

  return (
    <div className="relative overflow-hidden w-full min-h-screen md:min-h-[90vh] flex flex-col">
      <div 
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxOffset}px, 0)` }}
      >
        <Image
          src={HeroBg}
          alt="Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#020617]"></div>
      </div>

      <div 
        ref={navRef}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white shadow-lg py-2 border-b border-gray-100" 
            : "bg-transparent border-b border-white/10 py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className={`relative transition-all duration-300 ${isScrolled ? "w-[120px] h-[40px]" : "w-[150px] h-[50px]"}`}>
              <Image src={Logo} alt="Techera Logo" fill className="object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-md font-medium">
            <DropdownMenu 
              label="Công ty" 
              items={companyDropdownItems}
              isScrolled={isScrolled}
            />
            {[
              { label: "Giải pháp", href: "/giai-phap" },
              { label: "Blog", href: "/blog" },
              // { label: "Mạng Lưới", href: "/mang-luoi" },
              { label: "Liên hệ", href: "/lien-he" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors font-semibold ${
                  isScrolled 
                    ? "text-slate-600 hover:text-blue-600" 
                    : "text-slate-200 hover:text-blue-400 drop-shadow-sm"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className={`w-6 h-0.5 ${isScrolled ? "bg-slate-800" : "bg-white"} transition-all mb-1.5 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
            <div className={`w-6 h-0.5 ${isScrolled ? "bg-slate-800" : "bg-white"} transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></div>
            <div className={`w-6 h-0.5 ${isScrolled ? "bg-slate-800" : "bg-white"} transition-all mt-1.5 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
          </button>

          <div className="hidden md:flex items-center gap-4">
            {/* <Button variant="primary" className="!py-2 !px-5 text-md cursor-pointer shadow-lg shadow-blue-500/20">
              Liên Hệ
            </Button> */}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ${mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
          <div className="p-4 space-y-2">
            <div className="border-b border-gray-100 pb-2 mb-2">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 px-3">Công ty</div>
              {companyDropdownItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-slate-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="p-1.5 bg-blue-100 rounded text-blue-600">
                    {item.icon}
                  </div>
                  {item.label}
                </Link>
              ))}
            </div>
            {[
              { label: "Giải pháp", href: "/giai-phap" },
              { label: "Blog", href: "/blog" },
              // { label: "Mạng Lưới", href: "/mang-luoi" },
              { label: "Liên hệ", href: "/lien-he" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block p-3 rounded-lg hover:bg-blue-50 text-slate-700 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* <Button variant="primary" className="w-full mt-4">
              Liên Hệ
            </Button> */}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-grow flex items-center justify-center pt-10 pb-20">
        <div 
          ref={heroContentRef}
          className="max-w-4xl mx-auto text-center px-4"
          style={{ 
            opacity: Math.max(0, 1 - scrollY / 500),
            transform: `translate3d(0, ${scrollY * 0.2}px, 0)`
          }}
        >
          
          <h1 className="text-[28px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 text-white drop-shadow-2xl">
            TECHERA: Hệ thống Quản lý <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-blue-200 block mt-2">
              & Phân Phối Vé Toàn Diện
            </span>
          </h1>
          <p className="text-slate-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md text-shadow-sm font-medium">
            Nền tảng quản lý và phân phối vé thông minh, giúp doanh nghiệp vận hành sự kiện,
            bán vé đa kênh và kiểm soát dữ liệu theo thời gian thực — tất cả trong một hệ thống duy nhất.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/gioi-thieu">
              <Button variant="primary" className="cursor-pointer shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 transition-all text-base px-8 py-4">
                Xem Giới Thiệu TECHERA
              </Button>
            </Link>
            <Link href="/giai-phap">
              <Button variant="secondary" className="cursor-pointer backdrop-blur-md bg-white/10 hover:bg-white/20 border-white/20 text-white text-base px-8 py-4">
                Khám Phá Giải Pháp
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div 
         ref={arrowRef}
         className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/50"
         style={{ opacity: Math.max(0, 1 - scrollY / 150) }}
      >
        <ArrowDown className="w-10 h-10" />
      </div>
    </div>
  );
};

export default Header;

