"use client";

import { useEffect, useRef } from "react";

/**
 * «1,000 км», «80,000+», «2.1 с», «99%» зэрэг утгын тоог дэлгэцэнд орж ирэхэд 0-ээс гүйлгэнэ.
 * - Сервер бүтэн утгыг рендерлэнэ (JS-гүй, SEO, дэлгэц уншигчид зөв)
 * - Хөдөлгөөнийг DOM-д шууд бичнэ (React state биш) — 60 кадр/с re-render хийхгүй
 * - «Хөдөлгөөн багасгах» асаалттай бол огт хөдлөхгүй
 */
const NUMBER = /^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/;

export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(NUMBER);
    if (!el || !match || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [, prefix, raw, suffix] = match;
    const target = Number(raw.replace(/,/g, ""));
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const format = (n: number) =>
      prefix + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

    let frame = 0;
    el.textContent = format(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(2, -10 * t); // easeOutExpo — эхэндээ хурдан, төгсгөлдөө зөөлөн зогсоно
          el.textContent = format(t === 1 ? target : target * eased);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value, duration]);

  return <span ref={ref}>{value}</span>;
}
