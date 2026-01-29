"use client";

import dynamic from "next/dynamic";
import LazyMount from "./LazyMount";

const TrustSignals = dynamic(() => import("./TrustSignalsStatic"), {
  ssr: true,
});

const Ecosystem = dynamic(() => import("@/components/Ecosystem"), {
  ssr: false,
  loading: () => <div className="py-20" />,
});
const Features = dynamic(() => import("@/components/Features"), {
  ssr: false,
  loading: () => <div className="py-20" />,
});
const AgentNetwork = dynamic(() => import("@/components/AgentNetwork"), {
  ssr: false,
  loading: () => <div className="py-20" />,
});
const PermissionMatrix = dynamic(() => import("@/components/PermissionMatrix"), {
  ssr: false,
  loading: () => <div className="py-20" />,
});

export default function HomeSections() {
  return (
    <>
      <TrustSignals />
      <LazyMount>
        <Ecosystem />
      </LazyMount>
      <LazyMount>
        <Features />
      </LazyMount>
      <LazyMount>
        <AgentNetwork />
      </LazyMount>
      <LazyMount>
        <PermissionMatrix />
      </LazyMount>
    </>
  );
}

