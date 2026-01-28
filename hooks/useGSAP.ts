"use client";

import { useEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation types
type AnimationType = 
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "scaleIn"
  | "slideInLeft"
  | "slideInRight"
  | "rotateIn"
  | "bounceIn";

interface UseGSAPOptions {
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  ease?: string;
  scrollTrigger?: boolean;
  triggerStart?: string;
  triggerEnd?: string;
  scrub?: boolean | number;
  stagger?: number;
  markers?: boolean;
}

// Get animation config based on type
const getAnimationConfig = (type: AnimationType) => {
  const configs: Record<AnimationType, gsap.TweenVars> = {
    fadeIn: { opacity: 0 },
    fadeInUp: { opacity: 0, y: 60 },
    fadeInDown: { opacity: 0, y: -60 },
    fadeInLeft: { opacity: 0, x: -60 },
    fadeInRight: { opacity: 0, x: 60 },
    scaleIn: { opacity: 0, scale: 0.8 },
    slideInLeft: { x: -100, opacity: 0 },
    slideInRight: { x: 100, opacity: 0 },
    rotateIn: { opacity: 0, rotation: -10, scale: 0.9 },
    bounceIn: { opacity: 0, y: 80, scale: 0.9 },
  };
  return configs[type];
};

// Main hook for single element animation
export function useGSAP<T extends HTMLElement>(
  options: UseGSAPOptions = {}
): RefObject<T | null> {
  const {
    animation = "fadeInUp",
    duration = 1,
    delay = 0,
    ease = "power3.out",
    scrollTrigger = true,
    triggerStart = "top 85%",
    triggerEnd = "bottom 20%",
    scrub = false,
    markers = false,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const fromConfig = getAnimationConfig(animation);
    const toConfig: gsap.TweenVars = {
      ...Object.fromEntries(
        Object.keys(fromConfig).map((key) => [key, key === "opacity" ? 1 : 0])
      ),
      duration,
      delay,
      ease,
    };

    if (animation === "scaleIn" || animation === "bounceIn" || animation === "rotateIn") {
      toConfig.scale = 1;
    }
    if (animation === "rotateIn") {
      toConfig.rotation = 0;
    }

    if (scrollTrigger) {
      toConfig.scrollTrigger = {
        trigger: element,
        start: triggerStart,
        end: triggerEnd,
        scrub: scrub,
        markers: markers,
        toggleActions: "play none none reverse",
      };
    }

    gsap.set(element, fromConfig);
    gsap.to(element, toConfig);

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element) {
          st.kill();
        }
      });
    };
  }, [animation, duration, delay, ease, scrollTrigger, triggerStart, triggerEnd, scrub, markers]);

  return ref;
}

// Hook for staggered animation of multiple children
export function useGSAPStagger<T extends HTMLElement>(
  options: UseGSAPOptions = {}
): RefObject<T | null> {
  const {
    animation = "fadeInUp",
    duration = 0.8,
    delay = 0,
    ease = "power3.out",
    scrollTrigger = true,
    triggerStart = "top 85%",
    stagger = 0.15,
    markers = false,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.children;
    if (!children.length) return;

    const fromConfig = getAnimationConfig(animation);

    gsap.set(children, fromConfig);

    const toConfig: gsap.TweenVars = {
      ...Object.fromEntries(
        Object.keys(fromConfig).map((key) => [key, key === "opacity" ? 1 : 0])
      ),
      duration,
      delay,
      ease,
      stagger: stagger,
    };

    if (animation === "scaleIn" || animation === "bounceIn" || animation === "rotateIn") {
      toConfig.scale = 1;
    }
    if (animation === "rotateIn") {
      toConfig.rotation = 0;
    }

    if (scrollTrigger) {
      toConfig.scrollTrigger = {
        trigger: container,
        start: triggerStart,
        markers: markers,
        toggleActions: "play none none reverse",
      };
    }

    gsap.to(children, toConfig);

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) {
          st.kill();
        }
      });
    };
  }, [animation, duration, delay, ease, scrollTrigger, triggerStart, stagger, markers]);

  return ref;
}

// Hook for hero/intro animations (plays immediately, no scroll trigger)
export function useGSAPHero<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Animate children with staggered entrance
    const children = container.children;
    gsap.set(children, { opacity: 0, y: 50 });

    tl.to(children, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      delay: 0.3,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return ref;
}

// Text reveal animation
export function useGSAPTextReveal<T extends HTMLElement>(
  options: { delay?: number; duration?: number } = {}
): RefObject<T | null> {
  const { delay = 0, duration = 1 } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    gsap.set(element, {
      backgroundSize: "0% 100%",
    });

    gsap.to(element, {
      backgroundSize: "100% 100%",
      duration,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element) {
          st.kill();
        }
      });
    };
  }, [delay, duration]);

  return ref;
}

// Parallax effect hook
export function useGSAPParallax<T extends HTMLElement>(
  speed: number = 0.5
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    gsap.to(element, {
      y: () => speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element) {
          st.kill();
        }
      });
    };
  }, [speed]);

  return ref;
}

// Counter animation
export function useGSAPCounter<T extends HTMLElement>(
  endValue: number,
  options: { duration?: number; prefix?: string; suffix?: string } = {}
): RefObject<T | null> {
  const { duration = 2, prefix = "", suffix = "" } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const counter = { value: 0 };

    gsap.to(counter, {
      value: endValue,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      onUpdate: () => {
        element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element) {
          st.kill();
        }
      });
    };
  }, [endValue, duration, prefix, suffix]);

  return ref;
}

export default useGSAP;
