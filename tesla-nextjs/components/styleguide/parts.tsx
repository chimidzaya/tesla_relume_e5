import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Styleguide-ийн дугаартай хэсэг: «01 Зарчим» гэх мэт. Баруун талын нэг баганад hairline-аар тусгаарлагдана. */
export function SgSection({
  id,
  num,
  title,
  intro,
  children,
}: {
  id: string;
  num: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line py-16 first:border-t-0 first:pt-0 lg:py-20">
      <header className="mb-10 flex flex-col gap-4">
        <h2 className="flex items-baseline gap-4 text-h2">
          <span className="font-mono text-sm font-medium tabular-nums text-muted">{num}</span>
          {title}
        </h2>
        {intro && <p className="max-w-[564px] text-muted">{intro}</p>}
      </header>
      <div className="flex flex-col gap-14">{children}</div>
    </section>
  );
}

/** Хэсэг доторх жижиг гарчиг. */
export function SgSub({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl">{title}</h3>
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
        "rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-xs text-ink [overflow-wrap:anywhere]",
        className,
      )}
    >
      {children}
    </code>
  );
}

/** Жишээ + нэр + тайлбартай мөр (хэмжээ, зай, хөдөлгөөний жагсаалтад). */
export function SpecRow({
  name,
  value,
  note,
  children,
}: {
  name: ReactNode;
  value?: ReactNode;
  note?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <li className="grid gap-3 border-b border-line py-5 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-8">
      <div className="flex flex-col gap-1 font-sans text-sm">
        <span>{name}</span>
        {value && <span className="font-mono text-xs text-muted">{value}</span>}
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
          "min-h-[140px] rounded-xl border border-line p-6 sm:p-8",
          !block && "flex flex-wrap items-center gap-6",
          dark ? "border-transparent bg-ink text-on-dark" : "bg-paper",
          className,
        )}
      >
        {children}
      </div>
      <figcaption className="font-sans text-sm text-muted">{label}</figcaption>
    </figure>
  );
}

/** Өнгөний жижиг дээж */
export function Swatch({ color, className }: { color: string; className?: string }) {
  return <span className={cn("inline-block size-5 rounded-full border border-line align-middle", className)} style={{ background: color }} />;
}
