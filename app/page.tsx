import React from "react";
// import Section from "@/components/ui/Section";
import Header from "@/components/Header";
import TrustSignals from "@/components/TrustSignals";
// import Industries from "@/components/Industries";
import Features from "@/components/Features"; 
import Ecosystem from "@/components/Ecosystem";
import AgentNetwork from "@/components/AgentNetwork";
import PermissionMatrix from "@/components/PermissionMatrix";
// import DashboardPreview from "@/components/DashboardPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden">
      <Header />
      <TrustSignals />
      <Ecosystem />
      {/* <Industries /> */}
      <Features />
      <AgentNetwork />
      <PermissionMatrix />
      <Footer />
    </div>
  );
}
