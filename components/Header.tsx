"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./ui/Button";
import HeroBg from "@/public/images/hero-img.webp";
import Logo from "@/public/images/logo.jpg";
import { ArrowDown } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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

          <nav className="hidden md:flex items-center gap-8 text-md font-medium">
            {[
              { label: "Công ty", href: "#ecosystem" },
              { label: "Giải pháp", href: "#industries" },
              { label: "Blog", href: "#features" },
              { label: "Mạng Lưới", href: "#network" },
              { label: "Liên hệ", href: "#dashboard" },
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

          <div className="flex items-center gap-4">
            <Button variant="primary" className="!py-2 !px-5 text-md cursor-pointer shadow-lg shadow-blue-500/20">
              Liên Hệ
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-grow flex items-center justify-center pt-20 pb-20">
        <div 
          className="max-w-4xl mx-auto text-center px-4"
          style={{ 
            opacity: Math.max(0, 1 - scrollY / 500),
            transform: `translate3d(0, ${scrollY * 0.2}px, 0)`
          }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 text-white drop-shadow-2xl">
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
             <Button variant="primary" className="cursor-pointer shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 transition-all text-base px-8 py-4">
              Xem Giới Thiệu TECHERA
            </Button>
            <Button variant="secondary" className="cursor-pointer backdrop-blur-md bg-white/10 hover:bg-white/20 border-white/20 text-white text-base px-8 py-4">
              Tiêu Chuẩn Mới Cho Quản Lý Vé
            </Button>
          </div>
        </div>
      </div>
      
      <div 
         className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/50"
         style={{ opacity: Math.max(0, 1 - scrollY / 150) }}
      >
        <ArrowDown className="w-10 h-10" />
      </div>
    </div>
  );
};

export default Header;
