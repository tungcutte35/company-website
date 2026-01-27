import React from "react";
import Section from "./ui/Section";
import { Check } from "lucide-react";

const PermissionMatrix = () => {
  const features = [
    { name: "Bán hàng (Offline/Online)", l1: true, l2: true },
    { name: "Báo cáo & Đơn hàng", l1: true, l2: true },
    { name: "Quản lý KOL & Voucher", l1: true, l2: false },
    { name: "Quản lý Đại lý cấp dưới", l1: true, l2: false },
    { name: "Xem danh sách tài khoản", l1: true, l2: false },
    { name: "Cấu hình hệ thống", l1: true, l2: false },
  ];

  return (
    <Section id="permissions" className="py-10 ">
      <div className="bg-[#0f172a] rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl">
        <h3 className="text-3xl font-bold text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
           Ma Trận Phân Quyền (Permissions Matrix)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </span>
                    )}
                  </td>
                  <td className="p-4 border-b border-slate-800 text-center">
                    {item.l2 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-white">
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
