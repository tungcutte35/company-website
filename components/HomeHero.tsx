import Image from "next/image";
import Link from "next/link";
import HeroBg from "@/public/images/hero-img.webp";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden w-full min-h-screen md:min-h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src={HeroBg}
          alt="TECHERA Hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#020617]" />
      </div>

      <div className="relative z-10 w-full pt-28 pb-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-[28px] md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl">
            TECHERA: Hệ thống Quản lý
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-blue-200">
              &amp; Phân Phối Vé Toàn Diện
            </span>
          </h1>

          <p className="text-slate-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md font-medium">
            Nền tảng quản lý và phân phối vé thông minh, giúp doanh nghiệp vận hành sự kiện,
            bán vé đa kênh và kiểm soát dữ liệu theo thời gian thực — tất cả trong một hệ thống duy nhất.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/gioi-thieu"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 shadow-xl shadow-blue-600/20 transition-colors"
            >
              Xem Giới Thiệu TECHERA
            </Link>
            <Link
              href="/giai-phap"
              className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 backdrop-blur transition-colors"
            >
              Khám Phá Giải Pháp
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

