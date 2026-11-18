import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "blue" | "light" | "periwinkle";

const tones: Record<Tone, string> = {
  blue: "text-royal",
  light: "text-white/85",
  periwinkle: "text-periwinkle",
};

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-royal px-2.5 py-0.5 text-xs tracking-[0.04em] text-white">{children}</span>
  );
}

/** «СПОРТ СЕДАН» шиг жижиг дээд гарчиг, хүсвэл шошготой. */
export function Eyebrow({
  children,
  tone = "blue",
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
        "flex flex-wrap items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.08em]",
        tones[tone],
        className,
      )}
    >
      {badge && <Badge>{badge}</Badge>}
      {children}
    </p>
  );
}
