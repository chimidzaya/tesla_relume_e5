"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * «Цаг тань 24:13 хадгалагдана» — хугацааг секундээр тоолно (feedback + constraint: яарах шалтгааныг харуулна).
 * 0 болмогц хуудсыг шинэчилж, сервер цагийг цуцалсныг харуулна.
 */
export function HoldCountdown({ expiresAt }: { expiresAt: string }) {
  const router = useRouter();
  const end = new Date(expiresAt).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);

  const left = now === null ? null : Math.max(0, Math.floor((end - now) / 1000));

  useEffect(() => {
    if (left === 0) router.refresh();
  }, [left, router]);

  const urgent = left !== null && left < 5 * 60;
  const mm = left === null ? "--" : String(Math.floor(left / 60)).padStart(2, "0");
  const ss = left === null ? "--" : String(left % 60).padStart(2, "0");

  return (
    <p
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 font-sans text-sm transition-colors duration-500",
        urgent ? "bg-[#b3412b]/20 text-on-dark" : "bg-white/[0.06] text-on-dark-muted",
      )}
    >
      <span className="font-mono text-lg font-semibold tabular-nums text-on-dark" role="timer" aria-live="off">
        {mm}:{ss}
      </span>
      <span>дотор төлөөгүй бол цаг тань бусдад нээгдэнэ.</span>
    </p>
  );
}
