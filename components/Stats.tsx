import React from "react";
import Section from "./ui/Section";

const Stats = () => {
  return (
    <div className="relative py-24 border-y border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://placehold.co/1920x600/000000/1e1e1e.png?text=Landscape')] opacity-20 bg-cover bg-fixed"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]"></div>

      <Section className="relative z-10 text-center">
        <h2 className="text-2xl font-bold mb-12">About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {[
            { val: "9,000", label: "systems in the field" },
            { val: "252", label: "clients worldwide" },
            { val: "6", label: "countries worldwide" },
          ].map((stat, i) => (
            <div key={i} className="pt-8 md:pt-0 px-4">
              <p className="text-sm text-slate-400 uppercase tracking-widest mb-2">
                Over
              </p>
              <p className="text-5xl md:text-6xl font-bold text-white mb-2">
                {stat.val}
              </p>
              <p className="text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-xl text-left">
            <p className="text-sm text-slate-300">
              "Our mission is to be the catalyst for the autonomy revolution to
              enhance human capability."
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 p-6 rounded-xl text-left">
            <p className="text-sm text-slate-300">
              We collaborate with{" "}
              <span className="text-blue-400">high-stake sectors and industries</span>{" "}
              to perform rigorous R&D across product specs.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Stats;
