"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type SubNavItem = { id: string; label: string };

/** Хуудасны дотоод цэс — дээд цэсний доор наалдаж, одоо харж буй хэсгийг тодруулна. */
export function SubNav({ items }: { items: SubNavItem[] }) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const item of items) {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      data-subnav=""
      aria-label="Хуудасны хэсгүүд"
      className="sticky top-[72px] z-40 border-b border-line bg-paper px-gutter"
    >
      <div className="mx-auto flex max-w-site gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={current === item.id ? "true" : undefined}
            className={cn(
              "shrink-0 border-b-2 px-3 py-3.5 text-sm font-medium transition-colors duration-200",
              current === item.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
