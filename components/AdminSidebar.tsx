"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Users,
  FileText,
  Briefcase,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Sparkles,
  Globe,
  Bell
} from "lucide-react";
import { fetchJsonCached } from "@/lib/clientFetch";

// Sidebar Link Component
const SidebarLink = ({ 
  href,
  icon: Icon, 
  label, 
  active = false,
  badge
}: { 
  href: string;
  icon: React.ElementType; 
  label: string; 
  active?: boolean;
  badge?: number;
}) => (
  <Link
    href={href}
    prefetch={false}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="flex-1 text-left">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const fetchSidebarStats = async () => {
      try {
        const result = await fetchJsonCached<{ success: boolean; data?: any; error?: string }>(
          "/api/contact"
        );
        if (result.success) {
          setUnreadCount(result.data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Failed to fetch sidebar stats:', error);
      }
    };
    fetchSidebarStats();
  }, [router]);

  const handleLogout = async () => {
    await fetchJsonCached("/api/admin/login", { method: "DELETE" });
    router.push('/admin');
  };

  const getPageTitle = () => {
    if (pathname === '/admin/contact') return 'Tin nhắn liên hệ';
    if (pathname === '/admin/newsletter') return 'Newsletter';
    if (pathname === '/admin/blog') return 'Quản lý Blog';
    if (pathname === '/admin/careers') return 'Tuyển dụng';
    if (pathname === '/admin/faq') return 'FAQ';
    return 'Admin';
  };

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-slate-950 border-r border-white/10 z-50 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Techera Admin</h1>
              <p className="text-xs text-slate-500">Management Portal</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <SidebarLink href="/admin/contact" icon={Mail} label="Tin nhắn liên hệ" badge={unreadCount} active={pathname === "/admin/contact"} />
            <SidebarLink href="/admin/newsletter" icon={Users} label="Newsletter" active={pathname === "/admin/newsletter"} />
            <SidebarLink href="/admin/blog" icon={FileText} label="Blog" active={pathname === "/admin/blog"} />
            <SidebarLink href="/admin/careers" icon={Briefcase} label="Tuyển dụng" active={pathname === "/admin/careers"} />
            <SidebarLink href="/admin/faq" icon={HelpCircle} label="FAQ" active={pathname === "/admin/faq"} />
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link href="/" prefetch={false} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
              <Globe className="w-5 h-5" />
              <span>Xem Website</span>
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer">
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">{getPageTitle()}</h2>
                <p className="text-sm text-slate-500">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
