import Image from "next/image";
import Link from "next/link";
import Logo from "../public/images/logo.jpg";
import { MapPin, Mail, Facebook, PhoneCall, FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-6">
              <Image src={Logo} alt="PSYS Logo" width={150} height={50} className="object-contain" />
            </Link>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wide">
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
              {/* <div className="flex gap-2 text-slate-400">
                <Mail className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <a href="mailto:admin@psys.com.vn" className="hover:text-white transition-colors">
                  
                </a>
              </div> */}
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
              {[
                "Giới thiệu",
                "Tại sao chọn Teachera?",
                "Văn hóa Teachera",
                "Quy trình làm việc của Teachera",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Giải pháp & Dịch vụ */}
          <div>
            <h4 className="text-blue-400 font-bold mb-6 uppercase tracking-wide text-sm">
              Giải pháp & Dịch vụ
            </h4>
            <ul className="space-y-3">
              {[
                "Giải pháp công nghệ",
                
                "Giải pháp bảo mật & an toàn thông tin",
                
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Dịch vụ khách hàng */}
          <div>
            <h4 className="text-blue-400 font-bold mb-6 uppercase tracking-wide text-sm">
              Dịch vụ khách hàng
            </h4>
            <ul className="space-y-3">
              {[
                "Giới thiệu",
                "Chính sách bảo mật",
                "Liên hệ",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
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
