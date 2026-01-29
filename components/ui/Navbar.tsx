"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";
import Logo from "@/public/images/logo.jpg";
import { ChevronDown, Building2, Users, Menu, X } from "lucide-react";

// Dropdown Menu Component
const DropdownMenu = ({ 
  label, 
  items, 
  isScrolled 
}: { 
  label: string; 
  items: { label: string; href: string; icon: React.ReactNode; description: string }[];
  isScrolled: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`flex items-center gap-1 transition-colors font-semibold ${
          isScrolled 
            ? "text-slate-600 hover:text-blue-600" 
            : "text-slate-200 hover:text-blue-400 drop-shadow-sm"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div className={`absolute top-full left-0 pt-2 transition-all duration-200 ${isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-1 min-w-[230px]">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <div>
                <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {item.label}
                </div>
                <div className="text-sm text-slate-500">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

interface NavbarProps {
  variant?: "transparent" | "solid";
}

const Navbar = ({ variant = "solid" }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(variant === "solid");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const companyDropdownItems = [
    {
      label: "Giới thiệu",
      href: "/gioi-thieu",
      icon: <Building2 className="w-5 h-5" />,
      description: "Tìm hiểu về Techera",
    },
    {
      label: "Tuyển dụng",
      href: "/tuyen-dung",
      icon: <Users className="w-5 h-5" />,
      description: "Cơ hội nghề nghiệp",
    },
  ];

  useEffect(() => {
    if (variant === "transparent") {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 0);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [variant]);

  const navBackground = variant === "solid" 
    ? "bg-white shadow-lg border-b border-gray-100" 
    : isScrolled 
      ? "bg-white shadow-lg border-b border-gray-100" 
      : "bg-transparent border-b border-white/10";

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 py-3 ${navBackground}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-[120px] h-[40px]">
              <Image src={Logo} alt="Techera Logo" fill className="object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-md font-medium">
            <DropdownMenu 
              label="Công ty" 
              items={companyDropdownItems}
              isScrolled={isScrolled || variant === "solid"}
            />
            {[
              { label: "Giải pháp", href: "/giai-phap" },
              { label: "Blog", href: "/blog" },
              { label: "FAQ", href: "/faq" },
              { label: "Liên hệ", href: "/lien-he" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors font-semibold ${
                  isScrolled || variant === "solid"
                    ? "text-slate-600 hover:text-blue-600" 
                    : "text-slate-200 hover:text-blue-400 drop-shadow-sm"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled || variant === "solid" ? "text-slate-800" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled || variant === "solid" ? "text-slate-800" : "text-white"}`} />
            )}
          </button>

          <div className="hidden md:flex items-center gap-4">
            {/* <Button variant="primary" className="!py-2 !px-5 text-md cursor-pointer shadow-lg shadow-blue-500/20">
              Liên Hệ
            </Button> */}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-[64px] left-0 right-0 z-40 bg-white shadow-lg transition-all duration-300 md:hidden ${mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <div className="p-4 space-y-2">
          <div className="border-b border-gray-100 pb-2 mb-2">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 px-3">Công ty</div>
            {companyDropdownItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="p-1.5 bg-blue-100 rounded text-blue-600">
                  {item.icon}
                </div>
                {item.label}
              </Link>
            ))}
          </div>
          {[
            { label: "Giải pháp", href: "/giai-phap" },
            { label: "Blog", href: "/blog" },
            { label: "FAQ", href: "/faq" },
            { label: "Liên hệ", href: "/lien-he" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block p-3 rounded-lg hover:bg-blue-50 text-slate-700 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/lien-he" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="primary" className="w-full mt-4">
              Liên Hệ
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;

