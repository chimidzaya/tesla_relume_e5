import type { Model } from "@/data/models";

/** "1,000 км", "$36,990", "1.9 с" → 1000, 36990, 1.9. Тоо олдохгүй бол null. */
export function toNumber(value: string): number | null {
  const n = Number.parseFloat(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Утга нь хамгийн их (эсвэл бага) загвар ба тэр утга. getValue нь утгагүй бол undefined буцаана. */
export function pickBest(
  models: Model[],
  getValue: (model: Model) => string | undefined,
  mode: "max" | "min",
): { model: Model; value: string } | undefined {
  let best: { model: Model; value: string; n: number } | undefined;
  for (const model of models) {
    const value = getValue(model);
    const n = value === undefined ? null : toNumber(value);
    if (value === undefined || n === null) continue;
    if (!best || (mode === "max" ? n > best.n : n < best.n)) best = { model, value, n };
  }
  return best && { model: best.model, value: best.value };
}

/** 0–97 км/ц хурдатгалын үзүүлэлт (байвал) */
export const acceleration = (model: Model) => model.specs.find((spec) => spec.label.startsWith("0–"))?.value;
