"use client";

import React, { useRef, useEffect, useState } from "react";
import { 
  Phone, 
  Clock, 
  Send,
  MessageSquare,
  Building2,
  CheckCircle2,
  Loader2,
  FileText
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/ui/Navbar";
import Button from "@/components/ui/Button";
import Footer from "@/components/Footer";
import { fetchJsonCached } from "@/lib/clientFetch";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Contact Info Card Component
const ContactCard = ({ 
  icon: Icon, 
  title, 
  content, 
  subContent 
}: { 
  icon: React.ElementType; 
  title: string; 
  content: string;
  subContent?: string;
}) => (
  <div className="flex gap-4 p-6 bg-slate-900/80 backdrop-blur rounded-2xl border border-white/10">
    <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
      <Icon className="w-6 h-6 text-white" aria-hidden="true" />
    </div>
    <div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-slate-300">{content}</p>
      {subContent && <p className="text-slate-400 text-sm mt-1">{subContent}</p>}
    </div>
  </div>
);

export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const data = await fetchJsonCached<{ success: boolean; data?: any; error?: string; errors?: string[] }>(
        "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            service: formData.subject,
            message: formData.message,
          }),
        }
      );
      
      if (!data.success) {
        setSubmitError(data.errors ? data.errors.join(', ') : (data.error || 'Có lỗi xảy ra'));
        return;
      }
      
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: ""
      });
    } catch {
      setSubmitError('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#020617]">
        <Navbar variant="solid" />
        <main id="main-content" role="main">

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <div ref={heroRef} className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
            <MessageSquare className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            <span className="text-cyan-400 text-sm font-medium">Liên hệ với chúng tôi</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.3]">
            Bắt đầu hành trình
            <span className="block pb-1 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              số hóa cùng Techera
            </span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Đội ngũ tư vấn của chúng tôi sẵn sàng hỗ trợ bạn tìm ra giải pháp phù hợp nhất 
            cho doanh nghiệp của bạn.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Thông tin liên hệ</h2>
              
              <ContactCard 
                icon={Building2}
                title="Văn phòng chính"
                content="Lầu 2, Toà nhà Sacombank"
                subContent="63B Đường Calmette, Phường Bến Thành, TP.HCM"
              />
              
              <ContactCard 
                icon={Phone}
                title="Hotline"
                content="1900866629"
                subContent="Miễn phí trong giờ hành chính"
              />
              
              <ContactCard 
                icon={FileText}
                title="MST"
                content="0312238777"
                subContent=""
              />
              
              <ContactCard 
                icon={Clock}
                title="Giờ làm việc"
                content="Thứ 2 - Thứ 6: 8:00 - 17:00"
                subContent="Thứ 7: 8:00 - 12:00"
              />
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-slate-900/80 backdrop-blur rounded-3xl border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Gửi tin nhắn cho chúng tôi</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Gửi thành công!</h3>
                    <p className="text-slate-400 mb-6">
                      Cảm ơn bạn đã liên hệ. Đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ.
                    </p>
                    <Button 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Gửi tin nhắn khác
                    </Button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="0901 234 567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Công ty
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Tên công ty"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Chủ đề *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="demo">Yêu cầu demo sản phẩm</option>
                        <option value="pricing">Tư vấn báo giá</option>
                        <option value="partnership">Hợp tác kinh doanh</option>
                        <option value="support">Hỗ trợ kỹ thuật</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Nội dung *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        placeholder="Mô tả nhu cầu của bạn..."
                      />
                    </div>

                    {submitError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {submitError}
                      </div>
                    )}

                    <Button 
                      type="submit"
                      variant="primary" 
                      className="w-full py-3 cursor-pointer flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                          <span>Đang gửi...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" aria-hidden="true" />
                          <span>Gửi tin nhắn</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-900/80 backdrop-blur rounded-3xl border border-white/10 p-2 overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5748970630866!2d106.69698457573598!3d10.767208959362291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1555e31fd1%3A0x599482d0e6b81604!2zNjNCIMSQLiBDYWxtZXR0ZSwgUGjGsOG7nW5nIE5ndXnhu4VuIFRow6FpIELDrG5oLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1769570012359!5m2!1sen!2s" 
              width="100%" 
              height="450" 
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
              title="Bản đồ văn phòng Techera tại 63B Calmette, Quận 1, TP.HCM"
              aria-label="Google Maps hiển thị vị trí văn phòng Techera"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Câu hỏi thường gặp</h2>
            <p className="text-slate-400">Những thắc mắc phổ biến từ khách hàng</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Techera phù hợp với doanh nghiệp nào?",
                a: "Techera phục vụ các khu du lịch, điểm tham quan, công viên giải trí, tổ chức sự kiện và các doanh nghiệp cần quản lý, phân phối vé."
              },
              {
                q: "Chi phí triển khai như thế nào?",
                a: "Chi phí được tính dựa trên quy mô và nhu cầu cụ thể của doanh nghiệp. Liên hệ với chúng tôi để nhận báo giá chi tiết."
              },
              {
                q: "Thời gian triển khai mất bao lâu?",
                a: "Thời gian triển khai cơ bản từ 2-4 tuần, tùy thuộc vào mức độ tùy chỉnh và tích hợp cần thiết."
              },
              {
                q: "Có hỗ trợ kỹ thuật sau triển khai không?",
                a: "Có, chúng tôi cung cấp hỗ trợ kỹ thuật 24/7 qua hotline, email và hệ thống ticket."
              },
            ].map((faq, index) => (
              <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
