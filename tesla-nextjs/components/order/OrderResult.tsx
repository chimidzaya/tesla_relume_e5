import { WordReveal } from "@/components/ui/WordReveal";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { h1 } from "@/components/ui/typography";

/** Төлбөрийн дараах (амжилттай / хүлээгдэж буй / цуцалсан) хуудасны нийтлэг бүрхүүл */
export function OrderResult({
  steps,
  icon,
  eyebrow,
  title,
  children,
  actions,
}: {
  /** Дээд талын алхмын зам (OrderSteps) */
  steps?: ReactNode;
  /** Гарчгийн өмнөх том дүрс — төлөвийг өнгө, хэлбэрээр шууд таниулна */
  icon?: ReactNode;
  eyebrow: string;
  title: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <section className="flex min-h-[80vh] items-center bg-ink px-gutter pb-20 pt-[136px] text-on-dark">
      <div className="mx-auto flex w-full max-w-site flex-col items-start gap-8">
        {steps}
        <div className="flex flex-col items-start gap-5">
          {icon}
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
          <h1 className={h1}>
            <WordReveal text={title} delay={250} />
          </h1>
        </div>
        <div className="flex w-full max-w-[564px] flex-col gap-5 text-base text-on-dark-muted">{children}</div>
        <div className="flex flex-wrap gap-3">{actions}</div>
      </div>
    </section>
  );
}

/** Төлөвийн дүрс: ✓ (ногоон) · … (taupe) · ✕ (улаан) */
export function StatusIcon({ status }: { status: "paid" | "pending" | "stopped" }) {
  const styles = {
    paid: "bg-[#3f8a4a] text-white",
    pending: "bg-taupe text-ink",
    stopped: "bg-[#b3412b] text-white",
  }[status];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-14 items-center justify-center rounded-full",
        // Хуудас нээгдэхэд жижгээс томорч гарна (Tailwind 4 starting: = CSS @starting-style)
        "transition duration-500 ease-out motion-safe:starting:scale-50 starting:opacity-0",
        // Хүлээгдэж буй үед зөөлөн лугшина — «ажиллаж байна» гэсэн feedback
        status === "pending" && "motion-safe:animate-pulse",
        styles,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        {status === "paid" && <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinejoin="round" />}
        {status === "pending" && (
          <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4l2.5 2" strokeLinejoin="round" />
          </>
        )}
        {status === "stopped" && <path d="M7 7l10 10M17 7L7 17" />}
      </svg>
    </span>
  );
}

/** Баримт маягийн мэдээллийн жагсаалт (metaphor: дэлгүүрийн баримт) */
export function Receipt({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="w-full rounded-2xl bg-white/[0.06] px-5 py-2 font-sans text-sm shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)]">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`flex justify-between gap-4 py-3 ${i > 0 ? "border-t border-dashed border-white/15" : ""}`}
        >
          <dt className="text-on-dark-muted">{row.label}</dt>
          <dd className="text-right text-on-dark">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
