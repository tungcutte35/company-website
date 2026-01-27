import React from "react";
import Section from "./ui/Section";
import { Building2, TicketCheck, Users } from "lucide-react";
import Image from "next/image";
import Vinpearl from "../public/images/logo-vinpearl.png"
import Sunworld from "../public/images/logo-sunworld.png"
import Vinwonder from "../public/images/logo-vinwonder.png"
const Ecosystem = () => {
  return (
    <Section id="ecosystem" className="relative py-24 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse "></div>

      <div className="text-center mb-40 relative z-10">
        <h2 className="text-3xl  md:text-5xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-purple-400">
          Tổng quan Hệ sinh thái Techera
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg font-light">
          Một nền tảng kết nối thống nhất, nơi mọi luồng dữ liệu đều được đồng bộ
          hóa tức thì.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto aspect-[4/3] md:aspect-[16/9] flex items-center justify-center">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 800 450"
        >
          <defs>
            <linearGradient
              id="lineGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
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

          {/* Supplier (Top) → TECHERA (Center) */}
            <path
              d="M 400 10 L 399.9 140"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="animate-dash"
              markerEnd="url(#arrow)"
            />

           <path
              d="M 200 10 L 399.9 140"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="6 6"
              className="animate-dash"
              markerEnd="url(#arrow)"
            />
            <path
              d="M 590 0 L 399.9 140"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="6 6"
              className="animate-dash"
              markerEnd="url(#arrow)"
            />

          {/* Center to Bottom Left (200, 350) */}
          <path
            d="M 370 300 L 250 360"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-dash"
            markerEnd="url(#arrow)"
          />

          {/* Center to Bottom Right (600, 350) */}
          <path
            d="M 430 300 L 550 360"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-dash"
            markerEnd="url(#arrow)"
          />

          

          {/* Inter-node connections for "Ecosystem" feel */}
          <path
            d="M 280 300 Q 400 400 520 300"
            stroke="#ffffff"
            strokeOpacity="0.05"
            strokeWidth="1"
            fill="none"
          />

          
          
        </svg>

        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative flex items-center justify-center w-48 h-48">
            <div className="absolute inset-0 rounded-full border border-blue-500/30 border-t-blue-400 animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-4 rounded-full border border-purple-500/30 border-b-purple-400 animate-[spin_15s_linear_infinite_reverse]"></div>

            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>

            <div className="relative z-10 w-32 h-32 bg-slate-950 rounded-full flex flex-col items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tighter">
                TECHERA
              </span>
              <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent my-1"></div>
              <span className="text-[10px] text-blue-200 uppercase tracking-widest">
                Core System
              </span>
            </div>
          </div>
        </div>

        <div className="absolute mb-20 -top-1/10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="w-24 h-24 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <Image src={Sunworld} alt="Sunworld" width={150} height={150} className="px-1" />
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">
              SUNWORLD
            </h3>
            <span className="text-xs text-slate-200  bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
              Suppliers
            </span>
          </div>
        </div>

        <div className="absolute mb-20 -top-1/10 left-1/4 -translate-x-1/2 z-20 flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="w-24 h-24 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <Image src={Vinpearl} alt="Vinpearl" width={150} height={150} />
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">
              VINPEARL
            </h3>
            <span className="text-xs text-slate-200  bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
              Suppliers
            </span>
          </div>
        </div>

        <div className="absolute mb-20 -top-1/10 right-1/6 -translate-x-1/2 z-20 flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="w-24 h-24 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <Image src={Vinwonder} alt="Vinwonder" width={150} height={150}  />
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">
              ZALOPAY
            </h3>
            <span className="text-xs text-slate-200  bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
              Suppliers
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-[5%] md:left-[20%] z-20 flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="w-24 h-24 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-green-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)] group-hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Users className="w-10 h-10 text-green-400" />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-white font-bold text-lg group-hover:text-green-400 transition-colors">
              Đại Lý
            </h3>
            <span className="text-xs text-slate-200 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
              Agencies
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 right-[5%] md:right-[20%] z-20 flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="w-24 h-24 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-orange-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.2)] group-hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <TicketCheck className="w-10 h-10 text-orange-400" />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">
              Hệ Thống Vé
            </h3>
            <span className="text-xs text-slate-200 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
              Ticket System
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Ecosystem;
