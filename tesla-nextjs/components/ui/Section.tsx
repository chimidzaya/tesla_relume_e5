import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "white" | "surface" | "dark";

const tones: Record<Tone, string> = {
  white: "bg-white",
  surface: "bg-surface",
  dark: "bg-ink text-white",
};

/** Хуудасны хэсэг: ижил хажуугийн болон дээд/доод зай, 1280px хүртэлх төв контейнер. */
export function Section({
  id,
  tone = "white",
  className,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-28", tones[tone], className)}>
      <div className="mx-auto w-full max-w-site">{children}</div>
    </section>
  );
}
