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
      <div className="flex min-h-[120px] w-full items-center gap-4 rounded-lg border border-line bg-surface p-6">
        {[0, 1, 2].map((i) => (
          <div
            key={`${key}-${i}`}
            data-reveal=""
            className={cn("h-16 flex-1 rounded-lg bg-royal/80", visible && "is-visible")}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={replay}
        className="rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:bg-ink/5"
      >
        ↻ Дахин тоглуулах
      </button>
    </div>
  );
}
