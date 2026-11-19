"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Доторх бүх `.spotlight` картад хулганы байрлалыг (--x, --y) өгч, гэрлийг асаана (--on).
 * Нэг гэрлийг бүлэг хуваалцдаг тул хулгана нэг картаас нөгөө рүү шилжихэд хөрш картын
 * хүрээ ч ойрын талаасаа гэрэлтэнэ (Linear/Vercel маяг).
 * - Зөвхөн хулганатай төхөөрөмжид; утсанд юу ч хийхгүй, картууд хэвийн харагдана
 * - DOM-ийн CSS хувьсагчийг rAF-аар шууд шинэчилнэ (React re-render хийхгүй)
 */
export function SpotlightGroup({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const group = ref.current;
    if (!group || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // Бүлэг өөрөө карт байж болно (жишээ нь харьцуулах хүснэгт)
    const cards = () => [
      ...(group.classList.contains("spotlight") ? [group] : []),
      ...group.querySelectorAll<HTMLElement>(".spotlight"),
    ];
    let frame = 0;

    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        cards().forEach((card) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--x", `${event.clientX - rect.left}px`);
          card.style.setProperty("--y", `${event.clientY - rect.top}px`);
          card.style.setProperty("--on", "1");
        });
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      cards().forEach((card) => card.style.setProperty("--on", "0"));
    };

    group.addEventListener("pointermove", move);
    group.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      group.removeEventListener("pointermove", move);
      group.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
