import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { h1 } from "@/components/ui/typography";

/** Төлбөрийн дараах (амжилттай / цуцалсан) хуудасны нийтлэг бүрхүүл */
export function OrderResult({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <section className="flex min-h-[80vh] items-center bg-ink px-gutter pb-20 pt-[140px] text-on-dark">
      <div className="mx-auto flex w-full max-w-site flex-col items-start gap-5">
        <Eyebrow tone="light">{eyebrow}</Eyebrow>
        <h1 className={h1}>{title}</h1>
        <div className="flex max-w-[564px] flex-col gap-4 text-base text-on-dark-muted">{children}</div>
        <div className="mt-2 flex flex-wrap gap-3">{actions}</div>
      </div>
    </section>
  );
}
