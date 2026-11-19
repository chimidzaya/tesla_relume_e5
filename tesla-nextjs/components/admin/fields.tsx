import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 font-sans text-base text-ink outline-none transition-colors duration-200 placeholder:text-muted/70 focus:border-ink aria-[invalid=true]:border-[#b3412b]";

export const submitClass =
  "inline-flex min-h-[46px] items-center justify-center rounded-full bg-taupe px-6 font-sans text-base font-medium text-ink transition duration-200 hover:bg-taupe-hover active:translate-y-px disabled:opacity-60";

/** Шошго + оролт + алдааны мессеж */
export function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm", className)}>
      <span className="font-sans font-medium text-ink">{label}</span>
      {children}
      {hint && !error && <span className="font-sans text-muted">{hint}</span>}
      {error && <span className="font-sans text-[#b3412b]">{error}</span>}
    </label>
  );
}

/** Маягтын бүлэг (гарчигтай карт) */
export function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-5 rounded-2xl bg-paper/60 p-6 shadow-[inset_0_0_0_1px_var(--color-line)] sm:grid-cols-2">
      <legend className="float-left mb-1 w-full font-sans text-lg font-semibold text-ink sm:col-span-2">{legend}</legend>
      {children}
    </fieldset>
  );
}
