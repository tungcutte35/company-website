import React from "react";
import Image from "next/image";
import Section from "./ui/Section";
import Button from "./ui/Button";

const News = () => {
  return (
    <Section id="news" className="bg-white text-slate-900 !max-w-none">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">
            Latest News From Us
          </h2>
          <p className="text-slate-400 mt-2">
            Find out what we are up to in the industry.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Advanced Navigation opens new high-tech robotics facility",
              date: "12 January 2024",
              img: "https://placehold.co/600x400/e2e8f0/1e293b?text=Facility",
            },
            {
              title: "Revolutionizing Subsea Navigation: The new Boreas",
              date: "4 December 2023",
              img: "https://placehold.co/600x400/e2e8f0/1e293b?text=Subsea+Tech",
            },
            {
              title: "Partnering for the future of Defense Operations",
              date: "11 November 2023",
              img: "https://placehold.co/600x400/e2e8f0/1e293b?text=Defense+Win",
            },
          ].map((news, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-slate-100 group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={news.img}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                  {news.title}
                </h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-3">
                  Detailed summary of the news article goes here. It provides
                  context about the headline and encourages the user to read
                  more.
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t pt-4">
                  <span>{news.date}</span>
                  <span className="text-blue-600 font-semibold cursor-pointer">
                    Read Article
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
            All News
          </button>
        </div>
      </div>
    </Section>
  );
};

export default News;

