"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { CAL_LINK, CAL_NAMESPACE, calConfig, type TestDriveModel } from "@/lib/cal";
import { ModelPicker, type PickerModel } from "./ModelPicker";

/** Cal-ын bookingSuccessfulV2-г React рүү дамжуулах DOM event (скрипт React-аас хойно ачаалагдаж болох тул) */
const BOOKED_EVENT = "testdrive:booked";

/**
 * Cal.com-ын embed код (cal.com-оос авсан хэвээр). Ачаалагдаж дуусаагүй байхад өгсөн
 * командууд (modal, on) дараалалд орж, embed.js ирмэгц биелнэ — эрт дарсан ч алдагдахгүй.
 */
const CAL_EMBED = `
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "${CAL_NAMESPACE}", {origin:"https://app.cal.com"});
Cal.config = Cal.config || {};
Cal.config.forwardQueryParams = true;
Cal.ns["${CAL_NAMESPACE}"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
Cal.ns["${CAL_NAMESPACE}"]("on", {action: "bookingSuccessfulV2", callback: function (e) {
  window.dispatchEvent(new CustomEvent("${BOOKED_EVENT}", { detail: e.detail && e.detail.data }));
}});
`;

type CalApi = (instruction: string, options?: unknown) => void;
declare global {
  interface Window {
    Cal?: { ns?: Record<string, CalApi> };
  }
}

function calApi(): CalApi | undefined {
  return window.Cal?.ns?.[CAL_NAMESPACE];
}

type TestDriveContextValue = {
  /** slug өгвөл тэр машинтай Cal шууд нээгдэнэ; өгөхгүй бол эхлээд машин сонгох цонх гарна */
  open: (slug?: string) => void;
};

const TestDriveContext = createContext<TestDriveContextValue | null>(null);

export function useTestDrive() {
  const value = useContext(TestDriveContext);
  if (!value) throw new Error("useTestDrive-ийг TestDriveProvider дотор ашиглана.");
  return value;
}

/**
 * Туршилтын жолоодлогын урсгал: 1 Машин → 2 Цаг (Cal popup) → 3 Төлбөр (20,000₮, Byl) → 4 Баталгаажих.
 * Layout-д нэг удаа байрлана: Cal скриптийг ачаалж, машин сонгох цонхыг агуулна.
 * Cal дээр цаг сонгомогц төлбөрийн хуудас (/test-drive/[uid]) руу шилжүүлнэ.
 */
export function TestDriveProvider({ models, children }: { models: PickerModel[]; children: ReactNode }) {
  const router = useRouter();
  const [picking, setPicking] = useState(false);

  const openCal = useCallback((model: TestDriveModel) => {
    const api = calApi();
    const config = calConfig(model);
    if (api) api("modal", { calLink: CAL_LINK, config });
    // Скрипт хаагдсан (ad-blocker г.м.) үед Cal.com-ын хуудсыг шинэ цонхонд нээнэ
    else window.open(`https://cal.com/${CAL_LINK}?${new URLSearchParams(config)}`, "_blank", "noopener");
  }, []);

  const open = useCallback(
    (slug?: string) => {
      const model = slug ? models.find((m) => m.slug === slug) : undefined;
      if (model) openCal(model);
      else setPicking(true);
    },
    [models, openCal],
  );

  // Cal дээр цаг сонгогдмогц (bookingSuccessfulV2) цонхыг хааж, төлбөрийн алхам руу шилжинэ
  useEffect(() => {
    const onBooked = (event: Event) => {
      const uid = (event as CustomEvent<{ uid?: string } | undefined>).detail?.uid;
      if (!uid) return;
      calApi()?.("closeModal");
      router.push(`/test-drive/${encodeURIComponent(uid)}`);
    };
    window.addEventListener(BOOKED_EVENT, onBooked);
    return () => window.removeEventListener(BOOKED_EVENT, onBooked);
  }, [router]);

  return (
    <TestDriveContext.Provider value={{ open }}>
      <Script id="cal-embed" strategy="afterInteractive">
        {CAL_EMBED}
      </Script>
      {children}
      <ModelPicker
        open={picking}
        models={models}
        onClose={() => setPicking(false)}
        onPick={(model) => {
          setPicking(false);
          openCal(model);
        }}
      />
    </TestDriveContext.Provider>
  );
}
