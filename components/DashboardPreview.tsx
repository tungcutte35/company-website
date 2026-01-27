import React from "react";
import Section from "./ui/Section";
import Image from "next/image";

const DashboardPreview = () => {
  return (
    <Section id="dashboard" className="py-20">
       <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Giao Diện Quản Trị Tối Ưu
          </h2>
          <p className="text-slate-400">
            Trực quan, dễ sử dụng, phân quyền chặt chẽ giữa Quản lý và Nhân viên.
          </p>
       </div>

       <div className="space-y-12">
          {/* Dashboard Level 1 */}
          <div className="group relative rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-xs text-slate-500">Dashboard - Đại Lý Cấp 1</span>
             </div>
             
             <div className="p-8 pt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Mockup Sidebar */}
                <div className="hidden md:block col-span-1 space-y-4">
                   {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className="h-4 bg-slate-800 rounded w-full animate-pulse"></div>
                   ))}
                </div>
                {/* Mockup Main Data */}
                <div className="col-span-3 grid grid-cols-3 gap-4">
                    <div className="col-span-3 h-40 bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                        <div className="h-full w-full flex items-end justify-between gap-2">
                           {[40, 60, 30, 80, 50, 90, 70, 45, 65, 85].map((h, i) => (
                              <div key={i} className="w-full bg-blue-600/80 rounded-t-sm hover:h-full transition-all duration-500" style={{ height: `${h}%` }}></div>
                           ))}
                        </div>
                    </div>
                    <div className="h-32 bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                        <div className="text-xs text-slate-500 mb-2">Total Revenue</div>
                        <div className="text-2xl font-bold text-white">$32,500</div>
                    </div>
                     <div className="h-32 bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                        <div className="text-xs text-slate-500 mb-2">Tickets Sold</div>
                        <div className="text-2xl font-bold text-white">1,245</div>
                    </div>
                     <div className="h-32 bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                        <div className="text-xs text-slate-500 mb-2">Active Agents</div>
                        <div className="text-2xl font-bold text-white">24</div>
                    </div>
                </div>
             </div>
          </div>
          
          <div className="flex justify-center">
             <div className="text-sm text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                ⭐ Giao diện Cấp 1: Đầy đủ tính năng quản trị hệ thống
             </div>
          </div>
       </div>
    </Section>
  );
};

export default DashboardPreview;
