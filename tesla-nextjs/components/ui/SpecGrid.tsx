import type { Spec } from "@/data/models";
import { cn } from "@/lib/cn";

/**
 * Үзүүлэлтийн тор: утга нь том, тайлбар нь жижиг (хэмжээгээр шатлал).
 * - rule: шугамаар хуваасан 2×2 тор (анхны хэлбэр)
 * - card: цагаан нэг дэвсгэр дээр нүднүүд (Gestalt — Common Region),
 *   нүд бүр ижил хэлбэртэй (Similarity), тоогоороо 2 эсвэл 3 багана.
 */
export function SpecGrid({ specs, variant = "rule" }: { specs: Spec[]; variant?: "rule" | "card" }) {
  if (variant === "card") {
    return (
      <dl
        className={cn(
          "grid gap-px overflow-hidden rounded-2xl bg-line shadow-[0_1px_2px_rgb(25_20_14/0.06)]",
          specs.length % 3 === 0 ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        {specs.map((spec) => (
          <div key={spec.label} className="flex flex-col-reverse gap-1 bg-paper px-4 py-4 sm:px-5">
            <dt className="font-sans text-xs leading-snug text-muted">{spec.label}</dt>
            <dd className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">{spec.value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className="my-3 grid grid-cols-2 border-t border-line">
      {specs.map((spec, i) => (
        <div
          key={spec.label}
          className={cn(
            "flex flex-col-reverse gap-1 border-b border-line py-5",
            i % 2 === 0 ? "pr-3 sm:pr-6" : "border-l pl-3 sm:pl-6",
          )}
        >
          <dt className="text-sm text-muted">{spec.label}</dt>
          <dd className="text-2xl font-semibold leading-tight tracking-tight sm:text-[32px]">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
