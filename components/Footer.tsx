"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../public/images/logo.jpg";
import { MapPin, Mail, Facebook, PhoneCall, FileText } from "lucide-react";
import gsap from "gsap";

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple fade-in animation without ScrollTrigger
    // This ensures Footer always displays reliably
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const columns = gridRef.current.children;
        gsap.fromTo(
          columns,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      }

      if (bottomRef.current) {
        gsap.fromTo(
          bottomRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.5,
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#070707] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Footer Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-6">
              <Image src={Logo} alt="PSYS Logo" width={150} height={50} className="object-contain" />
            </Link>
            <h3 className="text-slate-400 font-bold text-sm mb-4 uppercase tracking-wide">
              CÔNG TY CỔ PHẦN TECHERA
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2 text-slate-400">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <div>
                  <p>63B Đường CALMETTE, Phường Bến Thành, TP.HCM</p>
                </div>
              </div>
              <div className="flex gap-2 text-slate-400">
                <PhoneCall className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <div>
                  <p>1900866629</p>
                </div>
              </div>
              <div className="flex gap-2 text-slate-400">
                <FileText className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <span className="hover:text-white transition-colors">
                  MST: 0312238777
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin công ty */}
          <div>
            <h4 className="text-blue-400 font-bold mb-6 uppercase tracking-wide text-sm">
              Thông tin công ty
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/gioi-thieu" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/giai-phap" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Tại sao chọn Techera?
                </Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Văn hóa Techera
                </Link>
              </li>
              <li>
                <Link href="/tuyen-dung" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Giải pháp & Dịch vụ */}
          <div>
            <h4 className="text-blue-400 font-bold mb-6 uppercase tracking-wide text-sm">
              Giải pháp & Dịch vụ
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/giai-phap" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Giải pháp công nghệ
                </Link>
              </li>
              <li>
                <Link href="/giai-phap" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Giải pháp bảo mật & an toàn thông tin
                </Link>
              </li>
            </ul>
          </div>

          {/* Dịch vụ khách hàng */}
          <div>
            <h4 className="text-blue-400 font-bold mb-6 uppercase tracking-wide text-sm">
              Dịch vụ khách hàng
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/gioi-thieu" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div ref={bottomRef} className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 Techera. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

