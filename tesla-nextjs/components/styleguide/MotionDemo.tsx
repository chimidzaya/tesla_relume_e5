"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Reveal хөдөлгөөнийг дахин тоглуулж үзэх демо (globals.css-ийн `[data-reveal]` дүрмийг ашиглана). */
export function RevealDemo() {
  const [key, setKey] = useState(0);
  const [visible, setVisible] = useState(true);

  function replay() {
    setVisible(false);
    setKey((k) => k + 1);
    // Дараагийн frame-д is-visible нэмж transition-ийг эхлүүлнэ
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex min-h-[120px] w-full items-center gap-4 rounded-xl border border-line bg-beige p-6">
        {[0, 1, 2].map((i) => (
          <div
            key={`${key}-${i}`}
            data-reveal=""
            className={cn("h-16 flex-1 rounded-xl bg-taupe", visible && "is-visible")}
            style={{ transitionDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={replay}
        className="rounded-full px-4 py-2 font-sans text-sm font-medium shadow-[inset_0_0_0_1px_var(--color-ink)] transition-[background-color,transform] duration-200 hover:bg-ink/[0.08] active:translate-y-px"
      >
        ↻ Дахин тоглуулах
      </button>
    </div>
  );
}
