"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Гүйлгэхэд агуулгыг зөөлөн гаргаж ирнэ.
 * JavaScript ажиллахгүй үед ч агуулга харагдана (globals.css-ийн `.js [data-reveal]` дүрмийг үз).
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal="" className={className}>
      {children}
    </div>
  );
}
