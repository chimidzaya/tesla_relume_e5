"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * 3D tilt — хулганы байрлалаар картыг бага зэрэг хазайлгана (бүтээгдэхүүнийг гартаа барьж эргүүлэх мэдрэмж).
 *
 * Шилдэг туршлагаас:
 * - Бага өнцөг (анхдагч 5°) — их өнцөг «тоглоом» мэт харагдаж, толгой эргүүлдэг
 * - perspective 1200px (Tailwind perspective-distant) — хол харагдах, зөөлөн гүн
 * - Хулгана дагахдаа шуурхай (150ms), холдоход удаан (700ms) буцна
 * - Гүн давхарга: хүүхэд элементүүд translate-z-*-ээр «хөвж» гарна (transform-3d)
 * - Гэрлийн тусгал (TiltGlare) хулганы байрлалыг дагана
 * - Зөвхөн хулганатай төхөөрөмжид, «хөдөлгөөн багасгах» унтраалттай үед; утсанд хэвийн зураг
 * - React state биш, CSS хувьсагч (--rx, --ry, --gx, --gy)-ийг rAF-аар шинэчилнэ
 *
 * Анхаар: хазайдаг давхарга дотор overflow-hidden байвал 3D гүн хавтгайрна — overflow-ийг дотор талын
 * хүүхэд элемент дээр тавина.
 */
export function Tilt({ children, max = 5, className }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    let frame = 0;
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width; // 0…1
      const py = (event.clientY - rect.top) / rect.height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${((0.5 - py) * max * 2).toFixed(2)}deg`); // дээш/доош
        el.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`); // зүүн/баруун
        el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
        el.setAttribute("data-tilting", "");
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.removeAttribute("data-tilting");
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max]);

  return (
    <div ref={ref} className={cn("group/tilt perspective-distant [--rx:0deg] [--ry:0deg]", className)}>
      <div
        className={cn(
          "relative transform-3d rotate-x-(--rx) rotate-y-(--ry)",
          "transition-transform duration-700 ease-out group-data-tilting/tilt:duration-150",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Хулганыг дагах гэрлийн тусгал — Tilt дотор, зургийн дээр байрлуулна */
export function TiltGlare() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.28),transparent_55%)] opacity-0 transition-opacity duration-500 group-data-tilting/tilt:opacity-100"
    />
  );
}
