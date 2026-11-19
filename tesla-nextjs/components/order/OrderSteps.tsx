import { cn } from "@/lib/cn";

/**
 * Төлбөрийн 3 алхмын зам (Norman: mapping + metaphor — «зам дээр хаана явна»).
 * Хэрэглэгч хаана байгаа, юу дууссан, юу үлдсэнийг нэг харцаар ойлгоно.
 */
export const ORDER_STEPS = ["Захиалгаа шалгах", "Byl-ээр төлөх", "Баталгаажих"] as const;

type Props = {
  /** Одоогийн алхам: 0, 1, 2 */
  current: 0 | 1 | 2;
  /** current алхмын байдал: явж буй / зогссон (цуцалсан) / бүгд дууссан */
  state?: "active" | "stopped" | "done";
  tone?: "dark" | "light";
};

export function OrderSteps({ current, state = "active", tone = "dark" }: Props) {
  const dark = tone === "dark";
  const shown = state === "done" ? ORDER_STEPS.length - 1 : current;

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-3">
    {/* Утсан дээр нэрс багтахгүй тул одоогийн алхмыг үгээр хэлнэ */}
    <p aria-hidden="true" className={cn("font-sans text-sm sm:hidden", dark ? "text-on-dark-muted" : "text-muted")}>
      Алхам {shown + 1}/{ORDER_STEPS.length} ·{" "}
      <span className={dark ? "text-on-dark" : "text-ink"}>{ORDER_STEPS[shown]}</span>
    </p>
    <ol aria-label="Захиалгын алхмууд" className="flex w-full items-center gap-3 font-sans text-sm">
      {ORDER_STEPS.map((label, i) => {
        const done = i < current || (i === current && state === "done");
        const isCurrent = i === current && state !== "done";
        const stopped = isCurrent && state === "stopped";

        return (
          <li
            key={label}
            aria-current={isCurrent ? "step" : undefined}
            className={cn("flex items-center gap-3", i < ORDER_STEPS.length - 1 && "flex-1")}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition duration-300",
                done && (dark ? "bg-on-dark text-ink" : "bg-ink text-on-dark"),
                isCurrent && !stopped && (dark ? "bg-taupe text-ink ring-4 ring-taupe/25" : "bg-ink text-on-dark ring-4 ring-ink/15"),
                stopped && "bg-[#b3412b] text-white ring-4 ring-[#b3412b]/25",
                !done && !isCurrent && (dark ? "text-on-dark-muted shadow-[inset_0_0_0_1px_rgb(255_255_255/0.3)]" : "text-muted shadow-[inset_0_0_0_1px_var(--color-line)]"),
              )}
            >
              {done ? <Check /> : stopped ? "!" : i + 1}
            </span>
            <span
              className={cn(
                "hidden whitespace-nowrap sm:inline",
                done || isCurrent ? (dark ? "text-on-dark" : "text-ink") : dark ? "text-on-dark-muted" : "text-muted",
                isCurrent && "font-medium",
              )}
            >
              {label}
              <span className="sr-only">
                {done ? " — дууссан" : stopped ? " — зогссон" : isCurrent ? " — одоогийн алхам" : ""}
              </span>
            </span>
            {i < ORDER_STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "h-px min-w-6 flex-1",
                  i < current ? (dark ? "bg-on-dark" : "bg-ink") : dark ? "bg-white/20" : "bg-line",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Цоож — «аюулгүй төлбөр» signifier */
export function LockIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" strokeLinecap="round" />
    </svg>
  );
}

export function Spinner({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn("animate-spin", className)} fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
