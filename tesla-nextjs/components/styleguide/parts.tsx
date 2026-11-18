import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Styleguide-ийн дугаартай хэсэг: «01 Зарчим» гэх мэт. */
export function SgSection({
  id,
  num,
  title,
  intro,
  children,
  tone = "white",
}: {
  id: string;
  num: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  tone?: "white" | "surface";
}) {
  return (
    <section
      id={id}
      className={cn(
        "border-t border-line px-5 py-16 sm:px-8 lg:px-16 lg:py-24",
        tone === "surface" ? "bg-surface" : "bg-white",
      )}
    >
      <div className="mx-auto max-w-site">
        <header className="mb-10 flex flex-col gap-3 lg:mb-14">
          <h2 className="flex items-baseline gap-4 text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[42px]">
            <span className="font-sans text-base font-semibold tabular-nums text-royal">{num}</span>
            {title}
          </h2>
          {intro && <p className="max-w-3xl text-lg text-muted">{intro}</p>}
        </header>
        <div className="flex flex-col gap-14">{children}</div>
      </div>
    </section>
  );
}

/** Хэсэг доторх жижиг гарчиг. */
export function SgSub({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-semibold tracking-[-0.01em]">{title}</h3>
        {note && <p className="text-muted">{note}</p>}
      </div>
      {children}
    </div>
  );
}

/** Токен, класс нэрийг харуулах жижиг код шошго. */
export function Code({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <code
      className={cn(
        "rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-ink [overflow-wrap:anywhere]",
        className,
      )}
    >
      {children}
    </code>
  );
}

/** Жишээ + нэр + тайлбартай мөр (хэмжээ, зай, хэлбэрийн жагсаалтад). */
export function SpecRow({ name, value, note, children }: { name: ReactNode; value?: ReactNode; note?: ReactNode; children?: ReactNode }) {
  return (
    <li className="grid gap-3 border-b border-line py-5 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] md:gap-8">
      <div className="flex flex-col gap-1 text-sm">
        <span>{name}</span>
        {value && <span className="font-mono text-[13px] text-muted">{value}</span>}
        {note && <span className="text-muted">{note}</span>}
      </div>
      {children && <div className="min-w-0">{children}</div>}
    </li>
  );
}

/** Компонентыг харуулах хүрээ. */
export function Specimen({
  label,
  dark,
  block,
  className,
  children,
}: {
  label: ReactNode;
  dark?: boolean;
  /** true: агуулгыг мөр болгохгүй, бүтэн өргөнөөр байрлуулна */
  block?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div
        className={cn(
          "min-h-[140px] rounded-lg border border-line p-6 sm:p-8",
          !block && "flex flex-wrap items-center gap-6",
          dark ? "border-transparent bg-ink text-white" : "bg-white",
          className,
        )}
      >
        {children}
      </div>
      <figcaption className="text-sm text-muted">{label}</figcaption>
    </figure>
  );
}
