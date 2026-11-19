"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Magnetic товч — хулгана ойртоход товч хулгана руу бага зэрэг «татагдана», холдоход зөөлөн буцна.
 * - Хүрээ нь товчноос 12px өргөн (p-3 / -m-3) тул хулгана товч дээр хүрэхээс өмнө эхэлнэ
 * - Хамгийн ихдээ `max` px (анхдагч 8) — үнэтэй брэндэд тохирох, хэтрүүлээгүй хэмжээ
 * - Зөвхөн хулганатай төхөөрөмж дээр, «хөдөлгөөн багасгах» унтраалттай үед ажиллана
 * - React state биш, DOM-ийн `translate`-ийг requestAnimationFrame-ээр шууд өөрчилнө (re-render хийхгүй)
 */
export function Magnetic({
  children,
  strength = 0.3,
  max = 8,
  className,
}: {
  children: ReactNode;
  /** Хулганы зайн хэдэн хувиар дагах вэ */
  strength?: number;
  /** Хамгийн их шилжилт (px) */
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    let frame = 0;
    const clamp = (value: number) => Math.max(-max, Math.min(max, value * strength));

    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = clamp(event.clientX - (rect.left + rect.width / 2));
      const y = clamp(event.clientY - (rect.top + rect.height / 2));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transitionDuration = "150ms"; // дагахдаа шуурхай
        el.style.translate = `${x}px ${y}px`;
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      el.style.transitionDuration = "600ms"; // буцахдаа удаан, пүрш шиг зөөлөн
      el.style.translate = "0px 0px";
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.style.translate = "";
    };
  }, [strength, max]);

  return (
    <span
      ref={ref}
      className={cn("-m-3 inline-block p-3 transition-transform ease-out will-change-transform", className)}
    >
      {children}
    </span>
  );
}
