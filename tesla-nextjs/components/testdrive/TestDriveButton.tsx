"use client";

import Script from "next/script";
import type { ReactNode } from "react";
import { buttonClass, type Size, type Variant } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";

/** Cal.com-ын «tesla-test-driving» event — туршилтын жолоодлогын цаг захиалга */
const CAL_NAMESPACE = "tesla-test-driving";
const CAL_LINK = "chimidzaya-dashpurew-dsf3hv/tesla-test-driving";
const CAL_CONFIG = JSON.stringify({ layout: "month_view", useSlotsViewOnSmallScreen: "true" });

/**
 * Cal.com-ын element-click embed код (cal.com-оос авсан хэвээр).
 * `data-cal-link` атрибуттай элемент дээр дарахад Cal өөрөө popup (modal) нээнэ.
 * `id`-тэй тул хуудсанд хэдэн товч байсан ч скрипт ганц л удаа ачаалагдана.
 */
const CAL_EMBED = `
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "${CAL_NAMESPACE}", {origin:"https://app.cal.com"});
Cal.config = Cal.config || {};
Cal.config.forwardQueryParams = true;
Cal.ns["${CAL_NAMESPACE}"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
`;

/**
 * «Туршилтын жолоодлого» товч — дарахад Cal.com-ын цаг захиалгын цонх popup-аар нээгдэнэ.
 * Хуудаснаас гарахгүй, захиалга дуусмагц цонхыг хаагаад үргэлжлүүлэн үзэх боломжтой.
 */
export function TestDriveButton({
  children = "Туршилтын жолоодлого",
  variant = "glass",
  size = "md",
  className,
}: {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <>
      <Script id="cal-embed" strategy="afterInteractive">
        {CAL_EMBED}
      </Script>
      <Magnetic>
        <button
          type="button"
          aria-haspopup="dialog"
          data-cal-link={CAL_LINK}
          data-cal-namespace={CAL_NAMESPACE}
          data-cal-config={CAL_CONFIG}
          className={buttonClass(variant, size, className)}
        >
          <SteeringIcon />
          {children}
        </button>
      </Magnetic>
    </>
  );
}

/** Жолооны хүрд — «жолоодох» гэсэн metaphor */
function SteeringIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path d="M3 12h7M14 12h7M12 14v7" strokeLinecap="round" />
    </svg>
  );
}
