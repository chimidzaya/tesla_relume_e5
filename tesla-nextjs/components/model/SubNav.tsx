"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type SubNavItem = { id: string; label: string };

/**
 * Хуудасны дотоод цэс — дээд цэсний доор наалдаж, одоо харж буй хэсгийг тодруулна.
 * Shared layout хөдөлгөөн:
 * - Идэвхтэй хэсгийн зураас нэг элемент бөгөөд шинэ цэс рүү «сунаж» шилжинэ
 * - Хулгана аль цэсний дээр байгааг beige сүүдэр гулсаж дагана (эхний удаа байрандаа гарч ирнэ)
 */
export function SubNav({ items }: { items: SubNavItem[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const prevIndex = useRef(-1);

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

  // Зураасыг идэвхтэй цэсний доор байрлуулна; урагшлах тал нь түрүүлж, ард тал нь 100ms хоцорно
  useLayoutEffect(() => {
    const place = (animate: boolean) => {
      const track = trackRef.current;
      const bar = barRef.current;
      const link = current ? linkRefs.current[current] : null;
      if (!track || !bar) return;
      if (!link) {
        bar.style.opacity = "0";
        return;
      }
      const index = items.findIndex((item) => item.id === current);
      const first = prevIndex.current < 0;
      const forward = index > prevIndex.current;
      bar.style.transitionDuration = animate && !first ? "" : "0s";
      bar.style.transitionDelay = forward ? "100ms, 0ms" : "0ms, 100ms"; // left, right
      bar.style.left = `${link.offsetLeft + 12}px`;
      // right нь scroll талбайн харагдах өргөнөөс (clientWidth) тоологдоно — гүйлгэгдсэн цэст сөрөг байж болно
      bar.style.right = `${track.clientWidth - link.offsetLeft - link.offsetWidth + 12}px`;
      bar.style.opacity = "1";
      prevIndex.current = index;
      // Утсан дээр идэвхтэй цэс харагдахуйц байлгана (хэвтээ гүйлгэлт)
      if (track.scrollWidth > track.clientWidth) {
        track.scrollTo({ left: link.offsetLeft - track.clientWidth / 2 + link.offsetWidth / 2, behavior: "smooth" });
      }
    };
    place(true);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [current, items]);

  function showGhost(link: HTMLAnchorElement) {
    const ghost = ghostRef.current;
    if (!ghost) return;
    const appearing = ghost.style.opacity !== "1";
    // Эхний удаа гулсахгүй, байрандаа бүдгэрч гарна; дараа нь цэс хооронд гулсана
    ghost.style.transitionProperty = appearing ? "opacity" : "";
    ghost.style.width = `${link.offsetWidth}px`;
    ghost.style.transform = `translateX(${link.offsetLeft}px)`;
    ghost.style.opacity = "1";
    if (appearing) requestAnimationFrame(() => (ghost.style.transitionProperty = ""));
  }

  function hideGhost() {
    if (ghostRef.current) ghostRef.current.style.opacity = "0";
  }

  return (
    <nav
      data-subnav=""
      aria-label="Хуудасны хэсгүүд"
      className="sticky top-[72px] z-40 border-b border-line bg-paper px-gutter"
    >
      <div
        ref={trackRef}
        onPointerLeave={hideGhost}
        className="relative mx-auto flex max-w-site gap-2 overflow-x-auto py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Hover сүүдэр — хулганатай төхөөрөмжид л */}
        <span
          ref={ghostRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1.5 left-0 w-0 rounded-lg bg-beige opacity-0 transition-[transform,width,opacity] duration-300 ease-out motion-reduce:transition-none"
        />
        {/* Идэвхтэй хэсгийн зураас — нэг элемент, цэс хооронд сунаж шилжинэ */}
        <span
          ref={barRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-ink opacity-0 transition-[left,right] duration-[420ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none"
        />
        {items.map((item) => (
          <a
            key={item.id}
            ref={(el) => {
              linkRefs.current[item.id] = el;
            }}
            href={`#${item.id}`}
            aria-current={current === item.id ? "true" : undefined}
            onPointerEnter={(event) => event.pointerType === "mouse" && showGhost(event.currentTarget)}
            className={cn(
              "relative shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
              current === item.id ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
