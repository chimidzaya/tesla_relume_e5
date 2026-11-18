import type { Spec } from "@/data/models";
import { cn } from "@/lib/cn";

/** 2×2 үзүүлэлтийн тор: утга нь том, тайлбар нь жижиг. */
export function SpecGrid({ specs }: { specs: Spec[] }) {
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
          <dd className="text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[30px] lg:text-4xl">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
