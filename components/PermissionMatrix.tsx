"use client";

import React, { useRef, useEffect } from "react";
import Section from "./ui/Section";
import { Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PermissionMatrix = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const features = [
    { name: "Bán hàng (Offline/Online)", l1: true, l2: true },
    { name: "Báo cáo & Đơn hàng", l1: true, l2: true },
    { name: "Quản lý KOL & Voucher", l1: true, l2: false },
    { name: "Quản lý Đại lý cấp dưới", l1: true, l2: false },
    { name: "Xem danh sách tài khoản", l1: true, l2: false },
    { name: "Cấu hình hệ thống", l1: true, l2: false },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate container
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate title with gradient reveal
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate table headers
      if (tableRef.current) {
        const headers = tableRef.current.querySelectorAll("th");
        gsap.fromTo(
          headers,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tableRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Animate table rows with stagger
        const rows = tableRef.current.querySelectorAll("tbody tr");
        gsap.fromTo(
          rows,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tableRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Animate checkmarks with pop effect
        const checkmarks = tableRef.current.querySelectorAll(".checkmark");
        gsap.fromTo(
          checkmarks,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: tableRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={sectionRef} id="permissions" className="py-10 ">
      <div ref={containerRef} className="bg-[#0f172a] rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl">
        <h3 
          ref={titleRef}
          className="text-3xl font-bold text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400"
        >
           Ma Trận Phân Quyền (Permissions Matrix)
        </h3>

        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-700 text-slate-400 font-medium">Tính năng</th>
                <th className="p-4 border-b border-slate-700 text-white font-bold text-center bg-blue-900/20 rounded-t-xl">
                    Đại Lý Cấp 1
                    <span className="block text-[10px] text-blue-400 font-normal uppercase mt-1">Full Control</span>
                </th>
                <th className="p-4 border-b border-slate-700 text-white font-bold text-center">Đại Lý Cấp 2</th>
              </tr>
            </thead>
            <tbody>
              {features.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 border-b border-slate-800 text-slate-300 font-medium">{item.name}</td>
                  <td className="p-4 border-b border-slate-800 text-center bg-blue-900/10">
                    {item.l1 && (
                      <span className="checkmark inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </span>
                    )}
                  </td>
                  <td className="p-4 border-b border-slate-800 text-center">
                    {item.l2 ? (
                      <span className="checkmark inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-white">
                         <Check className="w-4 h-4" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
};

export default PermissionMatrix;
