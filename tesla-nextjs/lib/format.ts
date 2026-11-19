/** 3000000 → «3,000,000₮» */
export const formatMNT = (amount: number) => `${Math.round(amount).toLocaleString("en-US")}₮`;

const WEEKDAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];
const EN_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * «11-р сарын 24, Мягмар · 10:30» — Улаанбаатарын цагаар.
 * Олон хөтөч mn-MN огноог дэмждэггүй тул хэсгүүдийг нь аваад гараар угсарна.
 */
export function formatDateTimeMN(iso: string) {
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
  return `${parts.month}-р сарын ${parts.day}, ${WEEKDAYS[EN_WEEKDAYS.indexOf(parts.weekday)]} · ${parts.hour}:${parts.minute}`;
}

/** «10:30» — Улаанбаатарын цагаар */
export function formatTimeMN(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ulaanbaatar", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}
