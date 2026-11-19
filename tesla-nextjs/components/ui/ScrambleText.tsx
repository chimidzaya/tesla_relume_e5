"use client";

import { Fragment, useEffect, useRef } from "react";

/**
 * Staggered text scramble — fantasy.co маягийн гарчгийн гаралт.
 *
 * Гоёмсог байлгах шийдлүүд:
 * - Байршил огт хөдлөхгүй: эцсийн үсэг бүр DOM-д байрандаа (нууцлагдсан) байж, санамсаргүй тэмдэгт
 *   нь түүний дээр давхарлагдана → мөр шилжихгүй, гарчиг «чичрэхгүй»
 * - Долгион: үсэг бүр зүүнээс баруун тийш ээлжлэн эхэлж, хэдэн удаа солигдоод тогтоно;
 *   урт гарчигт алхам богиносож нийт хугацаа ~1 сек-ээс хэтрэхгүй
 * - Тэмдэгтийн «жин» хадгална: том үсгийг кирилл том үсгээр, жижгийг жижгээр, тоог тоогоор солино
 * - Солигдож буй тэмдэгт бүдэг (60%), эцсийн үсэг тод болж тогтоно — нүд зөвхөн тогтсон үсгийг уншина
 * - Тэмдэгт 45ms тутам л солигдоно (60fps бүрт биш) — тайван, «дижитал» хэмнэл
 * - Дэлгэцэнд орж ирэхэд нэг удаа (IntersectionObserver)
 * - JS-гүй үед, «хөдөлгөөн багасгах» үед гарчиг шууд, бүтнээрээ харагдана
 * - Дэлгэц уншигч бүтэн гарчгийг нэг удаа уншина (sr-only), хөдөлгөөнт үсгүүдийг алгасна
 */

const UPPER = "АБВГДЕЖЗИКЛМНОӨПРСТУҮФХЦЧШЭЮЯ";
const LOWER = UPPER.toLowerCase();
const DIGIT = "0123456789";
const SYMBOL = "/+_#*<>";

function randomGlyph(ch: string) {
  const set = /\d/.test(ch) ? DIGIT : ch !== ch.toLowerCase() ? UPPER : ch !== ch.toUpperCase() ? LOWER : SYMBOL;
  return set[Math.floor(Math.random() * set.length)];
}

export function ScrambleText({
  text,
  delay = 0,
  className,
}: {
  text: string;
  /** Эхлэхээс өмнөх хүлээлт (мс) — жишээ нь eyebrow-ийн дараа гарчиг */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const chars = [...root.querySelectorAll<HTMLElement>("[data-ch]")];
    const finish = () =>
      chars.forEach((c) => {
        c.removeAttribute("data-active");
        c.setAttribute("data-done", "");
        (c.firstElementChild as HTMLElement).textContent = "";
      });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return finish();
    // Effect дахин ажиллавал (dev StrictMode, text солигдох) эхлэл төлөвт буцаана
    chars.forEach((c) => c.removeAttribute("data-done"));

    let frame = 0;
    const run = () => {
      const step = Math.min(32, 640 / Math.max(chars.length, 1)); // урт гарчигт долгион хурдасна
      const plan = chars.map((el, i) => ({
        el,
        glyph: el.firstElementChild as HTMLElement,
        final: el.dataset.ch ?? "",
        begin: i * step,
        end: i * step + 220 + Math.random() * 160, // үсэг бүр өөр урттай солигдоно
        last: 0,
        done: false,
      }));
      const start = performance.now() + delay;

      const tick = (now: number) => {
        const t = now - start;
        let pending = false;
        for (const p of plan) {
          if (p.done) continue;
          pending = true;
          if (t < p.begin) continue;
          if (t >= p.end) {
            p.el.removeAttribute("data-active");
            p.el.setAttribute("data-done", "");
            p.glyph.textContent = "";
            p.done = true;
            continue;
          }
          if (now - p.last > 45) {
            p.el.setAttribute("data-active", "");
            p.glyph.textContent = randomGlyph(p.final);
            p.last = now;
          }
        }
        if (pending) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.4, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      finish();
    };
  }, [text, delay]);

  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {/* Үг тасрахгүй — мөр зөвхөн үгийн хооронд шилжинэ */}
            <span className="inline-block whitespace-nowrap">
              {[...word].map((ch, ci) => (
                <span key={ci} data-ch={ch} className="group/ch relative inline-block">
                  {/* Санамсаргүй тэмдэгт — эцсийн үсгийн голд, бүдэг */}
                  <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 opacity-0 group-data-active/ch:opacity-60" />
                  {/* Эцсийн үсэг — JS ажиллаж буй үед тогтох хүртлээ нууцлагдана (зай нь хадгалагдана) */}
                  <span className="transition-opacity duration-150 motion-safe:in-[.js]:opacity-0 motion-safe:in-[.js]:group-data-done/ch:opacity-100">
                    {ch}
                  </span>
                </span>
              ))}
            </span>
            {wi < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
