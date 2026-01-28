import React from "react";
import Image from "next/image";
import Link from "next/link";
import Section from "./ui/Section";
import Button from "./ui/Button";
import { ChevronRight } from "lucide-react";

const Solutions = () => {
  return (
    <div className="bg-[#0f172a] py-20">
      <Section id="solutions">
        <div className="text-center mb-16">
          <h2 className="text-blue-500 font-semibold mb-2 uppercase tracking-wide">
            Our Solutions
          </h2>
          <p className="text-3xl font-bold mb-4">
            We know that unreliable navigation means more than just lost time.
          </p>
          <p className="text-slate-400">
            Our products are designed to operate in any environment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Boreas D70 & D90",
              desc: "High-level resilience for accuracy and reliability. FOG north-seeking performance. Free north-seeking gyrocompass.",
              img: "https://placehold.co/400x400/1e293b/ffffff?text=Boreas",
            },
            {
              name: "Certus Evo",
              desc: "Combining ultra-high accuracy MEMS with intelligence. GNSS/INS solution. Advanced RTK GNSS.",
              img: "https://placehold.co/400x400/1e293b/ffffff?text=Certus",
            },
            {
              name: "Certus Mini D",
              desc: "Essential navigation in a compact form factor. GNSS/INS solution. Advanced RTK GNSS.",
              img: "https://placehold.co/400x400/1e293b/ffffff?text=Mini",
            },
          ].map((prod, idx) => (
            <div
              key={idx}
              className="bg-zinc-200 rounded-3xl p-8 hover:bg-white transition-colors duration-300 group overflow-hidden relative"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3 text-slate-900">
                  {prod.name}
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed min-h-[60px]">
                  {prod.desc}
                </p>
                <Link
                  href="/giai-phap"
                  className="text-blue-600 text-sm font-bold hover:text-blue-700 inline-flex items-center gap-1 transition-all hover:gap-2 mb-8"
                >
                  Xem thêm{" "}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Product on Pedestal */}
              <div className="relative h-48 w-full mt-4 flex items-end justify-center">
                {/* Cylinder Pedestal */}
                <div className="absolute bottom-0 w-40 h-20 bg-gradient-to-b from-white to-zinc-200 rounded-[100%] shadow-[0_10px_20px_rgba(0,0,0,0.1)] transform translate-y-10 group-hover:translate-y-8 transition-transform duration-500"></div>
                <div className="absolute bottom-10 w-40 h-10 bg-white rounded-[100%] shadow-sm transform translate-y-10 group-hover:translate-y-8 transition-transform duration-500 z-10"></div>

                {/* Product Image */}
                <div className="relative z-20 mb-8 transform group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500">
                  <Image
                    src={prod.img}
                    alt={prod.name}
                    width={140}
                    height={140}
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/giai-phap">
            <Button variant="primary">Khám Phá Tất Cả Giải Pháp</Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};

export default Solutions;

