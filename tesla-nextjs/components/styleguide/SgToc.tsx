"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type TocItem = { id: string; num: string; label: string };

/**
 * Styleguide-ийн хэсгүүдийн цэс (scroll-spy).
 * Өргөн дэлгэцэнд зүүн талд наалддаг босоо жагсаалт, утсан дээр дээд талд наалддаг хэвтээ мөр.
 */
export function SgToc({ items }: { items: TocItem[] }) {
  const [current, setCurrent] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    for (const item of items) {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <>
      {/* Утас, таблет: хэвтээ мөр */}
      <nav
        data-subnav=""
        aria-label="Дизайн системийн хэсгүүд"
        className="sticky top-[72px] z-40 -mx-gutter border-b border-line bg-paper px-gutter lg:hidden"
      >
        <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={current === item.id ? "true" : undefined}
              className={cn(
                "shrink-0 border-b-2 px-3 py-3.5 font-sans text-sm font-medium transition-colors duration-200",
                current === item.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              <span className="mr-1.5 font-mono text-xs text-muted">{item.num}</span>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Компьютер: зүүн талын наалддаг жагсаалт */}
      <nav aria-label="Дизайн системийн хэсгүүд" className="hidden lg:block">
        <div className="sticky top-[calc(72px+40px)] flex flex-col gap-4">
          <p className="font-sans text-xs font-medium uppercase tracking-label text-muted">Агуулга</p>
          <ol className="flex flex-col">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current === item.id ? "true" : undefined}
                  className={cn(
                    "flex items-baseline gap-3 rounded-lg px-3 py-1.5 font-sans text-sm transition-colors duration-200",
                    current === item.id ? "bg-beige font-medium text-ink" : "text-muted hover:bg-ink/[0.04] hover:text-ink",
                  )}
                >
                  <span className="font-mono text-xs tabular-nums text-muted">{item.num}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
