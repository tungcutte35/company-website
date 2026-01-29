/* eslint-disable react-hooks/purity */
"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  DollarSign,
  Heart,
  Coffee,
  Laptop,
  GraduationCap,
  Plane,
  Gift,
  Users,
  ChevronRight,
  Search,
  Filter,
  ArrowRight,
  Sparkles
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Button from "@/components/ui/Button";
import Footer from "@/components/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Types
interface JobPosition {
  id: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  posted: string;
  deadline: string;
  active: boolean;
}

type CareersListCacheEntry = {
  jobs: JobPosition[];
  departments?: string[];
};

// Cache careers list requests (prevents double-fetch in dev Strict Mode)
const careersListCache = new Map<string, CareersListCacheEntry>();
const careersListInflight = new Map<string, Promise<CareersListCacheEntry>>();

// Benefit Card Component
const BenefitCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) => (
  <div className="group p-5 bg-slate-900 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all hover:-translate-y-1">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

// Job Card Component
const JobCard = ({ job }: { job: JobPosition }) => (
  <div className="group bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-blue-500/30 transition-all hover:-translate-y-1 relative overflow-hidden h-full flex flex-col">
    {/* Hot badge for recently posted jobs */}
    {new Date(job.posted) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
      <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        HOT
      </div>
    )}
    
    {/* Content area - grows to fill space */}
    <div className="flex-1 flex flex-col">
      <div className="mb-4">
        <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-3 py-1 rounded-full">
          {job.department}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
        {job.title}
      </h3>
      
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
        {job.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.requirements.slice(0, 3).map((req, index) => (
          <span key={index} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
            {req}
          </span>
        ))}
      </div>
      
      {/* This div grows to push button down */}
      <div className="flex-1"></div>
      
      <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {job.type}
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          {job.salary}
        </div>
      </div>
    </div>
    
    {/* Button always at bottom */}
    <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer">
      Ứng tuyển ngay
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

export default function CareersPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [departments, setDepartments] = useState<string[]>(["all"]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from API
  useEffect(() => {
    const cacheKey = selectedDepartment;
    const cached = careersListCache.get(cacheKey);
    if (cached) {
      setJobs(cached.jobs);
      if (cached.departments?.length) {
        setDepartments(["all", ...cached.departments]);
      }
      setLoading(false);
      return;
    }

    let didCancel = false;

    const fetchJobs = async () => {
      try {
        setLoading(true);

        const existing = careersListInflight.get(cacheKey);
        const promise =
          existing ??
          (async () => {
            const params = new URLSearchParams();
            if (selectedDepartment !== "all") {
              params.append("department", selectedDepartment);
            }

            const res = await fetch(`/api/careers?${params.toString()}`);
            const data = await res.json();

            const nextJobs: JobPosition[] = data?.data?.jobs ?? [];
            const nextDepartments: string[] | undefined = data?.data?.filters?.departments;

            if (data?.success) {
              const entry: CareersListCacheEntry = {
                jobs: nextJobs,
                departments: nextDepartments,
              };
              careersListCache.set(cacheKey, entry);
              return entry;
            }

            return { jobs: nextJobs, departments: nextDepartments };
          })();

        if (!existing) careersListInflight.set(cacheKey, promise);

        const entry = await promise;
        careersListInflight.delete(cacheKey);

        if (!didCancel) {
          setJobs(entry.jobs);
          if (entry.departments?.length) {
            setDepartments(["all", ...entry.departments]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        if (!didCancel) setLoading(false);
      }
    };

    fetchJobs();

    return () => {
      didCancel = true;
    };
  }, [selectedDepartment]);

  // Filter jobs by search term
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
        );
      }

      // Benefits animation
      if (benefitsRef.current) {
        gsap.fromTo(
          benefitsRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: benefitsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Jobs animation
      if (jobsRef.current) {
        gsap.fromTo(
          jobsRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: jobsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Navigation */}
      <Navbar variant="solid" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-blue-600/5 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div ref={heroRef} className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Tuyển dụng</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.3]">
            Xây dựng tương lai
            <span className="block pb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              cùng Techera
            </span>
          </h1>

          
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Gia nhập đội ngũ năng động, sáng tạo và đam mê công nghệ. 
            Cùng chúng tôi tạo nên những sản phẩm có giá trị cho hàng triệu người dùng.
          </p>

            <div className="flex items-center justify-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <span>{loading ? "..." : `${jobs.length} vị trí đang tuyển`}</span>
              </div>
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-400" />
                <span>HCM & Remote</span>
              </div>
            </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Quyền lợi khi gia nhập Techera
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Chúng tôi tin rằng nhân viên hạnh phúc sẽ tạo ra sản phẩm tuyệt vời
            </p>
          </div>

          <div ref={benefitsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <BenefitCard
              icon={DollarSign}
              title="Lương cạnh tranh"
              description="Mức lương hấp dẫn, review 2 lần/năm cùng thưởng KPI và lợi nhuận."
            />
            <BenefitCard
              icon={Heart}
              title="Bảo hiểm sức khỏe"
              description="Gói bảo hiểm Premium cho bạn và gia đình, khám sức khỏe định kỳ."
            />
            <BenefitCard
              icon={Laptop}
              title="Thiết bị hiện đại"
              description="MacBook Pro, màn hình 4K và mọi công cụ bạn cần để làm việc."
            />
            <BenefitCard
              icon={GraduationCap}
              title="Phát triển bản thân"
              description="Ngân sách học tập không giới hạn, tham gia conference, workshop."
            />
            <BenefitCard
              icon={Plane}
              title="Du lịch & Team building"
              description="Team building hàng quý, du lịch công ty hàng năm ở trong và ngoài nước."
            />
            <BenefitCard
              icon={Coffee}
              title="Văn phòng tuyệt vời"
              description="Đồ ăn nhẹ, cà phê miễn phí. Phòng gym, game room để thư giãn."
            />
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Vị trí đang tuyển dụng
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Tìm kiếm vị trí phù hợp với bạn
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm vị trí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="pl-12 pr-8 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer min-w-[180px]"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "Tất cả phòng ban" : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Cards */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div ref={jobsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {!loading && filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">Không tìm thấy vị trí phù hợp</p>
            </div>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Quy trình tuyển dụng
            </h2>
            <p className="text-slate-400">Đơn giản, minh bạch và nhanh chóng</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-20">
            {[
              { step: "01", title: "Nộp CV", desc: "Gửi CV và portfolio của bạn" },
              { step: "02", title: "Phỏng vấn HR", desc: "Trao đổi về kinh nghiệm và kỳ vọng" },
              { step: "03", title: "Technical", desc: "Đánh giá kỹ năng chuyên môn" },
              { step: "04", title: "Offer", desc: "Nhận offer và gia nhập team!" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="
              relative rounded-3xl p-10 md:p-16 overflow-hidden
              bg-slate-900/90 backdrop-blur
              border border-white/10
            "
          >
            {/* gradient nhẹ */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10"></div>

            {/* grid pattern */}
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.06]"></div>

            <div className="relative">
              <Gift className="w-12 h-12 text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" />

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Không thấy vị trí phù hợp?
              </h2>

              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Gửi CV của bạn cho chúng tôi. Chúng tôi luôn tìm kiếm những tài năng xuất sắc 
                và sẽ liên hệ khi có vị trí phù hợp.
              </p>

              <Link href="/lien-he">
                <Button
                  className="
                    inline-flex items-center gap-2
                    px-8 py-3 rounded-xl
                     text-slate-900 font-semibold
                    hover:bg-white/90 hover:text-gray-900
                    shadow-lg shadow-cyan-500/20
                    cursor-pointer
                  "
                >
                  Gửi CV ngay
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}
