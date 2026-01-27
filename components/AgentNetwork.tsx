import React from "react";
import Section from "./ui/Section";
import {  Users, TrendingUp, Percent, Star } from "lucide-react";
import Image from "next/image";
import AgentNetworkImage from "../public/images/agent-network.png";

const AgentNetwork = () => {
    return (
        <Section id="network" className="py-20">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                   Nhóm Tính năng Phát triển Mạng lưới
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                   Tự động hóa quy trình quản lý đại lý và tối ưu hóa doanh thu qua mạng lưới KOL.
                </p>
            </div>

            <div className="space-y-16">
                {/* Network Development Features */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl pt-8">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-blue-300 mb-2">Dành riêng cho Đại lý Cấp 1</h3>
                        
                    </div>
                    <div className="flex justify-center">
                        <Image src={AgentNetworkImage} alt="Agent Network" width={1500} height={1500} className="rounded-2xl" />
                    </div>
                    
                </div>

                {/* KOL Ecosystem */}
                <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-orange-400 mb-2">Hệ sinh thái tiếp thị KOL & Voucher</h3>
                        <p className="text-slate-400">Tối ưu hóa doanh thu qua kênh Influencer (Dành riêng Đại lý Cấp 1).</p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Central Circle */}
                        <div className="relative aspect-square max-w-sm mx-auto mb-8">
                            {/* Rotating border */}
                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-400/30 animate-[spin_30s_linear_infinite]"></div>
                            
                            {/* Center content */}
                            <div className="absolute inset-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex flex-col items-center justify-center text-center p-1 shadow-[0_0_30px_rgba(251,146,60,0.3)]">
                                <Star className="w-8 h-8 text-white mb-2" />
                                <h4 className="text-lg font-bold text-white mb-1">Thúc đẩy</h4>
                                <h4 className="text-lg font-bold text-white mb-1">Doanh số</h4>
                                <p className="text-xs text-orange-100">(Growth Engine)</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6 relative">
                            <div className="absolute -top-[220%] -left-[20%] bg-slate-800 border border-slate-700 rounded-xl p-6 relative">
                                <div className="absolute -top-3 -right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Star className="w-3 h-3 text-white" />
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Users className="w-8 h-8 text-orange-400" />
                                    <div>
                                        <h4 className="font-bold text-white">Quản lý KOL</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400">Tạo và quản lý danh sách đối tác KOL.</p>
                            </div>

                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative">
                                <div className="absolute -top-3 -right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Percent className="w-3 h-3 text-white" />
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Percent className="w-8 h-8 text-orange-400" />
                                    <div>
                                        <h4 className="font-bold text-white">Quản lý Voucher</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400">Cấp voucher khuyến mãi riêng cho từng KOL.</p>
                            </div>

                            <div className="absolute -top-[220%] -right-[20%] bg-slate-800 border border-slate-700 rounded-xl p-6 relative">
                                <div className="absolute -top-3 -right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-3 h-3 text-white" />
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingUp className="w-8 h-8 text-orange-400" />
                                    <div>
                                        <h4 className="font-bold text-white">Đơn hàng KOL</h4>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400">Thống kê doanh số và tính toán hiệu quả từ KOL.</p>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default AgentNetwork;
