export default function TrustSignalsStatic() {
  return (
    <section className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto py-8 px-4 text-center">
        <p className="text-slate-400 text-xl font-semibold uppercase tracking-widest mb-6">
          Được Tin Dùng Bởi Đối Tác &amp; Doanh Nghiệp Hàng Đầu
        </p>

        <div className="relative w-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0f172a] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0f172a] to-transparent z-10" />

          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-10 md:gap-20 mx-10 md:mx-20 shrink-0 opacity-100 grayscale hover:grayscale-0 transition-all duration-500"
              >
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
    </section>
  );
}

