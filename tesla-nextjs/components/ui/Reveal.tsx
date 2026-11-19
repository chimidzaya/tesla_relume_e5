"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Гүйлгэхэд агуулгыг доороос зөөлөн гаргаж ирнэ — бүхэлдээ Tailwind класс.
 * - `in-[.js]:` — JavaScript ажиллаж байгаа үед л нуудаг тул JS-гүй үед агуулга шууд харагдана
 * - `motion-safe:` — «хөдөлгөөн багасгах» тохиргоотой хэрэглэгчид огт нуухгүй, хөдөлгөхгүй
 * - `data-visible:` — дэлгэцэнд орж ирмэгц `data-visible` атрибут нэмэгдэж анхны байрлалдаа буцна
 */
export const revealClass = cn(
  "transition duration-700 ease-out",
  "motion-safe:in-[.js]:translate-y-4 motion-safe:in-[.js]:opacity-0",
  "motion-safe:in-[.js]:data-visible:translate-y-0 motion-safe:in-[.js]:data-visible:opacity-100",
);

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal="" data-visible={visible ? "" : undefined} className={cn(revealClass, className)}>
      {children}
    </div>
  );
}
