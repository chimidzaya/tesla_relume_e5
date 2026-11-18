"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import type { Trim } from "@/data/model-details";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** Хувилбаруудын таб. Хулганаар болон ← → товчоор солигдоно (WAI-ARIA tabs загвар). */
export function TrimTabs({ trims, orderUrl }: { trims: Trim[]; orderUrl: string }) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    const next = (index + direction + trims.length) % trims.length;
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Хувилбарууд"
        className="mb-8 flex gap-1 rounded-lg bg-surface p-1 sm:inline-flex"
      >
        {trims.map((trim, i) => (
          <button
            key={trim.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${trim.id}`}
            aria-controls={`panel-${trim.id}`}
            aria-selected={selected === i}
            tabIndex={selected === i ? 0 : -1}
            onClick={() => setSelected(i)}
            onKeyDown={(event) => handleKeyDown(event, i)}
            className={cn(
              "flex-1 rounded-md px-2 py-2.5 font-medium transition-colors sm:flex-none sm:px-6",
              selected === i ? "bg-white text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12)]" : "text-muted hover:text-ink",
            )}
          >
            {trim.name}
          </button>
        ))}
      </div>

      {trims.map((trim, i) => (
        <div
          key={trim.id}
          role="tabpanel"
          id={`panel-${trim.id}`}
          aria-labelledby={`tab-${trim.id}`}
          hidden={selected !== i}
          className="grid items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-14"
        >
          <div className="relative aspect-video overflow-hidden rounded-lg bg-[#f0f0f0]">
            <Image src={trim.image.src} alt={trim.image.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col items-start gap-4">
            <p className="text-4xl font-bold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">
              {trim.price}
              <span className="text-lg font-medium text-muted">-оос</span>
            </p>
            <p className="text-muted">{trim.summary}</p>
            <dl className="my-2 grid w-full grid-cols-3 gap-4 border-y border-line py-5">
              {trim.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <dd className="text-xl font-semibold sm:text-2xl">{stat.value}</dd>
                  <dt className="text-[13px] text-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
            <Button href={orderUrl}>Захиалах</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
