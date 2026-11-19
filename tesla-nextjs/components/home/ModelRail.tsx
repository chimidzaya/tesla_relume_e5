"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type RailItem = { slug: string; name: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Загварын бүлгийн зам (chapter rail) — нүүр хуудасны баруун талд, зөвхөн том дэлгэцэнд.
 * Автомашины конфигуратор/үзэсгэлэнгийн «түүх өгүүлэх» мэдрэмж:
 * - Загвар бүр нэг зураас; одоо харж буй загварын зураас урт болно (хажуугийн хоосон зайд л багтана)
 * - Зам дээр хулгана аваачихад бүх загварын дугаар, нэр гарна, дарахад тэр загвар руу гүйлгэнэ
 * - Цайвар/бараан хэсэг ээлжилдэг тул mix-blend-difference — аль ч дэвсгэр дээр өөрөө тодорно
 * - Загварын хэсгүүдийн гадна (hero, харьцуулалт) бүдгэрч алга болно
 */
export function ModelRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    // Дэлгэцийн яг голын шугамыг огтолж буй хэсэг = одоогийн загвар
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive(items.find((item) => visible.has(item.slug))?.slug ?? null);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const item of items) {
      const section = document.getElementById(item.slug);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Загварууд"
      className={cn(
        "group/rail fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 text-white mix-blend-difference xl:block",
        "transition-opacity duration-500",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ol className="flex flex-col items-end gap-1">
        {items.map((item, i) => {
          const current = item.slug === active;
          return (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                aria-current={current ? "true" : undefined}
                className="group/item flex items-center gap-3 py-1.5 font-sans text-2xs uppercase tracking-label"
              >
                {/* Нэр — зөвхөн зам дээр хулгана байхад; хулганы доорх нь тод */}
                <span className="translate-x-1 whitespace-nowrap opacity-0 transition duration-300 ease-out group-hover/rail:translate-x-0 group-hover/rail:opacity-60 group-hover/item:opacity-100">
                  {item.name}
                </span>
                {/* Дугаар — зам дээр хулгана байхад л (энгийн үед зөвхөн зураас — контенттой давхцахгүй) */}
                <span
                  className={cn(
                    "w-4 text-right tabular-nums opacity-0 transition-opacity duration-300",
                    current ? "group-hover/rail:opacity-100" : "group-hover/rail:opacity-50",
                  )}
                >
                  {pad(i + 1)}
                </span>
                {/* Зураас — одоогийн загварт урт, бусад нь богино */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px bg-current transition-[width,opacity] duration-500 ease-out",
                    current ? "w-8 opacity-100" : "w-3 opacity-40",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
