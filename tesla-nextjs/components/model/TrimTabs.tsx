"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Trim } from "@/data/model-details";
import { OrderButton, type OrderInfo } from "@/components/order/OrderButton";
import { cn } from "@/lib/cn";

/** Тексттэй дагалдах дараалсан хоцрогдол (Tailwind delay-*) */
const STAGGER = ["delay-0", "delay-70", "delay-140", "delay-210"];
/** Шинээр гарч ирэх мөр: доороос бүдгэрч орно (Tailwind 4 starting: = @starting-style) */
const enter = "transition duration-500 ease-out starting:opacity-0 motion-safe:starting:translate-y-2";

/** «$42,490» → { prefix: "$", value: 42490 } */
function parsePrice(price: string) {
  const match = price.match(/^([^\d]*)([\d,]+)/);
  return match ? { prefix: match[1], value: Number(match[2].replace(/,/g, "")) } : null;
}

/**
 * Хувилбаруудын таб — morphing tabs.
 * - Хар pill шинэ tab руу «сунаж» шилжинэ: урагшлах тал нь түрүүлж, ард тал нь 90ms хоцорч гүйцнэ
 * - Зураг бүдгэрч/томорч солигдоно, үнэ тоологдоно, тайлбар болон тоонууд дараалан доороос гарна
 * - Хулганаар болон ← → товчоор солигдоно (WAI-ARIA tabs). JS-гүй, «хөдөлгөөн багасгах» үед хөдөлгөөнгүй
 */
export function TrimTabs({ trims, order }: { trims: Trim[]; order: OrderInfo }) {
  const [selected, setSelected] = useState(0);
  const mounted = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevRef = useRef(0);
  const priceRef = useRef<HTMLSpanElement>(null);
  const shownPrice = useRef<number | null>(null);

  // Pill-ийг сонгосон tab дээр байрлуулна (left/right тусдаа шилжинэ → «сунах» эффект)
  useLayoutEffect(() => {
    const place = (animate: boolean) => {
      const list = listRef.current;
      const pill = pillRef.current;
      const tab = tabRefs.current[selected];
      if (!list || !pill || !tab) return;
      const forward = selected > prevRef.current;
      pill.style.transitionDuration = animate ? "" : "0s";
      pill.style.transitionDelay = forward ? "90ms, 0ms" : "0ms, 90ms"; // left, right
      pill.style.left = `${tab.offsetLeft}px`;
      pill.style.right = `${list.clientWidth - tab.offsetLeft - tab.offsetWidth}px`;
    };
    place(mounted.current);
    prevRef.current = selected;
    if (!mounted.current) {
      mounted.current = true;
      // data-ready: pill харагдаж, сонгосон tab-ын өөрийн хар дэвсгэр арилна (CSS variant)
      listRef.current?.setAttribute("data-ready", "");
    }

    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [selected]);

  // Үнэ тоологдох
  useEffect(() => {
    const el = priceRef.current;
    const target = parsePrice(trims[selected].price);
    if (!el || !target) return;
    const from = shownPrice.current ?? target.value;
    shownPrice.current = target.value;
    if (from === target.value || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = trims[selected].price;
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 700);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = target.prefix + Math.round(from + (target.value - from) * eased).toLocaleString("en-US");
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [selected, trims]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    const next = (index + direction + trims.length) % trims.length;
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  const trim = trims[selected];

  return (
    <div>
      <div
        ref={listRef}
        role="tablist"
        aria-label="Хувилбарууд"
        className="group/tabs relative mb-8 flex gap-1 rounded-full bg-beige p-1 sm:inline-flex"
      >
        {/* Морфлох pill — JS бэлэн болмогц (data-ready) л харагдана; тэр хүртэл сонгосон tab өөрөө хар */}
        <span
          ref={pillRef}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-1 rounded-full bg-ink opacity-0 group-data-ready/tabs:opacity-100",
            "transition-[left,right] duration-[420ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none",
          )}
        />
        {trims.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-controls="trim-panel"
            aria-selected={selected === i}
            tabIndex={selected === i ? 0 : -1}
            onClick={() => setSelected(i)}
            onKeyDown={(event) => handleKeyDown(event, i)}
            className={cn(
              "relative flex-1 rounded-full px-2 py-2.5 font-medium transition-colors duration-300 sm:flex-none sm:px-6",
              selected === i ? "bg-ink text-on-dark group-data-ready/tabs:bg-transparent" : "text-muted hover:text-ink",
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="trim-panel"
        aria-labelledby={`tab-${trim.id}`}
        className="grid items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-14"
      >
        {/* Бүх зураг давхарлагдсан: сонгосон нь тодорч, бусад нь бүдгэрч томорно */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-beige">
          {trims.map((t, i) => (
            <Image
              key={t.id}
              src={t.image.src}
              alt={i === selected ? t.image.alt : ""}
              aria-hidden={i !== selected}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className={cn(
                "object-cover transition-[opacity,scale,filter] duration-700 ease-out",
                i === selected ? "scale-100 opacity-100 blur-none" : "opacity-0 motion-safe:scale-105 motion-safe:blur-md",
              )}
            />
          ))}
        </div>

        <div className="flex flex-col items-start gap-4">
          <p className="font-sans text-2xl font-semibold leading-tight tracking-tight tabular-nums sm:text-[40px]">
            <span ref={priceRef}>{trim.price}</span>
            <span className="text-md font-medium text-muted">-оос</span>
          </p>
          {/* key солигдоход дахин mount болж starting: хөдөлгөөн тоглоно */}
          <p key={`s-${trim.id}`} className={cn("text-muted", enter, STAGGER[0])}>
            {trim.summary}
          </p>
          <dl key={`d-${trim.id}`} className="my-2 grid w-full grid-cols-3 gap-4 border-y border-line py-5">
            {trim.stats.map((stat, i) => (
              <div key={stat.label} className={cn("flex flex-col-reverse gap-0.5", enter, STAGGER[i + 1])}>
                <dt className="text-xs text-muted">{stat.label}</dt>
                <dd className="text-xl font-semibold tabular-nums sm:text-2xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <OrderButton order={order}>Захиалах</OrderButton>
        </div>
      </div>
    </div>
  );
}
