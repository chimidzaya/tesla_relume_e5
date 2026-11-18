import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "glass" | "outline-light" | "link";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-300";

const sizes: Record<Size, string> = {
  md: "min-h-[46px] px-7 py-2.5 text-base",
  sm: "min-h-10 px-5 py-[7px] text-[15px]",
};

const variants: Record<Variant, string> = {
  primary: "bg-gradient-to-r from-pink to-royal text-white shadow-[0_8px_24px_-8px_rgb(217_87_143/0.6)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgb(217_87_143/0.75)]",
  secondary: "bg-periwinkle/40 text-ink hover:bg-periwinkle/60",
  /** Бараан зурган дээрх хагас тунгалаг товч */
  glass: "bg-white/15 text-white hover:bg-white/25",
  "outline-light": "border-[1.5px] border-white/85 bg-white/10 text-white hover:bg-white hover:text-ink",
  link: "group px-1 text-ink",
};

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** «Дэлгэрэнгүй →» шиг сум нэмнэ */
  arrow?: boolean;
  className?: string;
  onClick?: () => void;
};

/** Сайт доторх холбоос бол next/link, гадаад холбоос бол шинэ цонхонд нээгдэх <a> болно. */
export function Button({ href, children, variant = "primary", size = "md", arrow, className, onClick }: ButtonProps) {
  const classes = cn(base, variant === "link" ? "min-h-[46px] text-base" : sizes[size], variants[variant], className);
  const content = (
    <>
      {children}
      {arrow && (
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      )}
    </>
  );

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {content}
    </Link>
  );
}
