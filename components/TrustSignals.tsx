"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TrustSignals = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate container with scale effect
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto py-8 px-4 text-center">
        <p 
          ref={titleRef}
          className="text-slate-400 text-xl font-semibold uppercase tracking-widest mb-6"
        >
          Được Tin Dùng Bởi Đối Tác & Doanh Nghiệp Hàng Đầu
        </p>
        
        <div ref={containerRef} className="relative w-full overflow-hidden mask-gradient">
          {/* Mask Gradient for smooth fade on edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0f172a] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0f172a] to-transparent z-10"></div>

          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-10 md:gap-20 mx-10 md:mx-20 shrink-0 opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                {["SUNWORLD", "VNPAY", "VIETTEL", "VINPEARL", "ZALOPAY"].map((logo) => (
                  <span
                    key={logo}
                    className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-200 to-slate-600 whitespace-nowrap"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default TrustSignals;

