"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Lenis — хулганы дугуйгаар гүйлгэхэд хуудас инерцтэй, зөөлөн гулсана.
 * - Хүрэлтээр (утас) гүйлгэхэд хөтчийн өөрийн гүйлгэлт хэвээр (syncTouch: false)
 * - #холбоосыг зөөлөн гүйлгэнэ; html-ийн scroll-padding-top-ийг тооцдог тул тогтмол цэсний доор нуугдахгүй
 * - «Хөдөлгөөн багасгах» асаалттай бол огт асахгүй
 * - Lenis хөтчийн жинхэнэ scroll-ийг хөдөлгөдөг тул CSS scroll-driven animation, IntersectionObserver хэвийн ажиллана
 */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
    return () => lenis.destroy();
  }, []);

  return null;
}
