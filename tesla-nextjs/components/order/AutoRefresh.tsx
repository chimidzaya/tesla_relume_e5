"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "./OrderSteps";

/**
 * Webhook ирэхийг хүлээх үед хуудсыг 3 сек тутам шинэчилнэ (Norman: feedback — хэрэглэгч
 * «Дахин шалгах» дарж таах шаардлагагүй). 20 оролдлогын дараа гараар шалгахыг санал болгоно.
 */
export function AutoRefresh({
  interval = 3000,
  max = 20,
  message = "Byl-ээс баталгаа хүлээж байна — хуудас өөрөө шинэчлэгдэнэ.",
}: {
  interval?: number;
  max?: number;
  message?: string;
}) {
  const router = useRouter();
  const [tries, setTries] = useState(0);
  const waiting = tries < max;

  useEffect(() => {
    if (!waiting) return;
    const timer = setTimeout(() => {
      router.refresh();
      setTries((n) => n + 1);
    }, interval);
    return () => clearTimeout(timer);
  }, [tries, waiting, interval, router]);

  return (
    <p aria-live="polite" className="flex items-center gap-2 font-sans text-sm text-on-dark-muted">
      {waiting ? (
        <>
          <Spinner /> {message}
        </>
      ) : (
        "Удаж байна. Доорх «Дахин шалгах» товчийг дарна уу."
      )}
    </p>
  );
}
