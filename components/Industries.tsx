import React from "react";
import Image from "next/image";
import Section from "./ui/Section";
import Button from "./ui/Button";
import { ArrowRight } from "lucide-react";

const Industries = () => {
  return (
    <Section id="industries" className="relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Lĩnh Vực TECHERA Phục Vụ
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          TECHERA cung cấp giải pháp quản lý và phân phối vé linh hoạt cho nhiều
          mô hình sự kiện, giải trí và dịch vụ khác nhau.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Sự Kiện & Concert",
            desc: "Quản lý bán vé, check-in nhanh chóng cho sự kiện, liveshow và hội nghị.",
            img: "https://placehold.co/600x400/020617/2563eb?text=Events",
          },
          {
            title: "Khu Giải Trí & Du Lịch",
            desc: "Phát hành vé điện tử cho công viên, khu vui chơi, điểm tham quan.",
            img: "https://placehold.co/600x400/020617/16a34a?text=Entertainment",
          },
          {
            title: "Rạp & Không Gian Văn Hóa",
            desc: "Tối ưu vận hành vé cho rạp chiếu phim, nhà hát, bảo tàng.",
            img: "https://placehold.co/600x400/020617/f97316?text=Cinema+%26+Culture",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-white/10 shadow-2xl"
          >
            <Image
              src={item.img}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.desc}
              </p>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="secondary" className="text-sm px-8">
          Xem Tất Cả Giải Pháp
        </Button>
      </div>
    </Section>
  );
};

export default Industries;
