import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "white" | "beige" | "dark";

const tones: Record<Tone, string> = {
  white: "bg-paper",
  beige: "bg-beige",
  dark: "bg-ink text-on-dark",
};

/** Хуудасны хэсэг: --gutter хажуугийн зай, --section-top/bottom, 1328px хүртэлх төв контейнер. */
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
    <section id={id} className={cn("px-gutter pb-section-bottom pt-section-top", tones[tone], className)}>
      <div className="mx-auto w-full max-w-site">{children}</div>
    </section>
  );
}
