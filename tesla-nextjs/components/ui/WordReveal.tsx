"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Гарчгийн гаралт — үг бүр бүдэг (blur) байдлаас тодорч, бага зэрэг дээш хөөрч гарна.
 * Apple, Linear, Vercel-ийн маягийн тайван, орчин үеийн editorial эффект.
 *
 * - Үсэг огт солигдохгүй: текст эхнээсээ зөв бичигдсэн, зөвхөн тодрол нь өөрчлөгдөнө
 * - Үгс зүүнээс баруун тийш 60ms зайтай ээлжлэн гарна, нэг үг 0.9 сек — зөөлөн, яаралгүй
 * - Байршил хөдлөхгүй (зөвхөн opacity / blur / translate) — мөр шилжихгүй
 * - Дэлгэцэнд орж ирэхэд нэг удаа (IntersectionObserver)
 * - JS-гүй, «хөдөлгөөн багасгах» үед гарчиг шууд бүтнээрээ харагдана
 * - Дэлгэц уншигч бүтэн гарчгийг нэг удаа уншина (sr-only)
 */
export function WordReveal({
  text,
  delay = 0,
  step = 60,
  className,
}: {
  text: string;
  /** Эхлэхээс өмнөх хүлээлт (мс) — жишээ нь eyebrow-ийн дараа гарчиг */
  delay?: number;
  /** Үг хоорондын зай (мс) */
  step?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.removeAttribute("data-in");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        root.setAttribute("data-in", "");
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [text]);

  const words = text.split(" ");

  return (
    <span ref={ref} className={cn("group/wr", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={i}>
            <span
              className={cn(
                "inline-block transition-[opacity,filter,translate] duration-900 ease-[cubic-bezier(0.2,0.7,0.2,1)]",
                "[transition-delay:calc(var(--d)+var(--i)*var(--s))]",
                // JS ажиллаж, хөдөлгөөн зөвшөөрөгдсөн үед л эхлээд нууцлагдана
                "motion-safe:in-[.js]:translate-y-[0.25em] motion-safe:in-[.js]:opacity-0 motion-safe:in-[.js]:blur-[8px]",
                "motion-safe:in-[.js]:group-data-in/wr:translate-y-0 motion-safe:in-[.js]:group-data-in/wr:opacity-100 motion-safe:in-[.js]:group-data-in/wr:blur-none",
              )}
              style={{ "--i": i, "--d": `${delay}ms`, "--s": `${step}ms` } as CSSProperties}
            >
              {word}
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
