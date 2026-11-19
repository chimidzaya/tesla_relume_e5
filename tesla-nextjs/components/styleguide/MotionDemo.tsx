"use client";

import { useState } from "react";
import { revealClass } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** Хайрцаг бүрийн хоцрогдол — Tailwind delay-* (0, 90, 180ms) */
const delays = ["delay-0", "delay-90", "delay-180"];

/** Reveal хөдөлгөөнийг дахин тоглуулж үзэх демо (Reveal-ийн Tailwind класстай ижил). */
export function RevealDemo() {
  const [key, setKey] = useState(0);
  const [visible, setVisible] = useState(true);

  function replay() {
    setVisible(false);
    setKey((k) => k + 1);
    // Дараагийн frame-д data-visible нэмж transition-ийг эхлүүлнэ
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex min-h-[120px] w-full items-center gap-4 rounded-xl border border-line bg-beige p-6">
        {delays.map((delay, i) => (
          <div
            key={`${key}-${i}`}
            data-visible={visible ? "" : undefined}
            className={cn(revealClass, delay, "h-16 flex-1 rounded-xl bg-taupe")}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={replay}
        className="rounded-full px-4 py-2 font-sans text-sm font-medium shadow-[inset_0_0_0_1px_var(--color-ink)] transition duration-200 hover:bg-ink/[0.08] active:translate-y-px"
      >
        ↻ Дахин тоглуулах
      </button>
    </div>
  );
}
