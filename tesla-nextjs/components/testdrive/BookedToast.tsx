"use client";

import { useEffect } from "react";

export type Booked = { model: string | null; startTime: string | null };

const WEEKDAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];

/** «11-р сарын 24, Мягмар · 10:30» — олон хөтөч mn-MN огноог дэмждэггүй тул гараар, Улаанбаатарын цагаар */
function formatWhen(iso: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Ulaanbaatar",
      month: "numeric",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(iso))
      .map((part) => [part.type, part.value]),
  );
  const weekday = WEEKDAYS[["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday)];
  return `${parts.month}-р сарын ${parts.day}, ${weekday} · ${parts.hour}:${parts.minute}`;
}

/**
 * Алхам 3 — баталгаажуулалт. Cal-ын цонхыг хаасны дараа ч сайт дээр
 * «юу, хэзээ захиалагдсан» нь харагдсаар байна (evaluation: зорилгодоо хүрсэн үү?).
 */
export function BookedToast({ booked, onDismiss }: { booked: Booked | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!booked) return;
    const timer = setTimeout(onDismiss, 15000);
    return () => clearTimeout(timer);
  }, [booked, onDismiss]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
      {booked && (
        <div
          role="status"
          className="pointer-events-auto flex w-full max-w-sm items-start gap-4 rounded-2xl bg-ink p-5 text-on-dark shadow-2xl transition duration-500 ease-out motion-safe:starting:translate-y-4 starting:opacity-0"
        >
          <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-on-dark text-sm text-ink">
            ✓
          </span>
          <div className="flex flex-1 flex-col gap-1 font-sans">
            <p className="font-sans font-semibold">Туршилтын жолоодлого баталгаажлаа</p>
            <p className="font-sans text-sm tabular-nums text-on-dark-muted">
              {[booked.model, booked.startTime && formatWhen(booked.startTime)].filter(Boolean).join(" · ")}
            </p>
            <p className="font-sans text-xs text-on-dark-muted">Дэлгэрэнгүйг таны имэйл рүү илгээлээ.</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Хаах"
            className="-mr-1 -mt-1 grid size-8 place-items-center rounded-full text-on-dark-muted transition-colors hover:bg-white/10 hover:text-on-dark"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
