import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "light" | "on-dark";

const tones: Record<Tone, string> = {
  /** Цайвар дэвсгэр дээр: туслах өнгө */
  default: "text-muted",
  /** Зураг дээр */
  light: "text-white/85",
  /** Бараан дэвсгэр дээр */
  "on-dark": "text-on-dark-muted",
};

/** FloorTag маягийн жижиг шошго: 10px, 0.12em */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-beige px-2.5 py-1 font-sans text-2xs font-medium uppercase leading-none tracking-tagline text-ink">
      {children}
    </span>
  );
}

/** REBA .eyebrow: sans 500 · 12px · 0.08em · uppercase · muted. Хүсвэл шошготой. */
export function Eyebrow({
  children,
  tone = "default",
  badge,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  badge?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-3 font-sans text-xs font-medium uppercase leading-snug tracking-label",
        tones[tone],
        className,
      )}
    >
      {badge && <Badge>{badge}</Badge>}
      {children}
    </p>
  );
}
