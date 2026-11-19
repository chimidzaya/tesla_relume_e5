import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Variant = "primary" | "dark" | "secondary" | "glass" | "outline-light" | "link" | "link-light";
export type Size = "md" | "sm";

/** REBA .btn: pill, sans 500, 0.2s өнгөний шилжилт, дарахад 1px доош суух (press feedback). */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium leading-body whitespace-nowrap transition duration-200 ease-in-out active:translate-y-px";

const sizes: Record<Size, string> = {
  md: "min-h-[46px] px-6 py-2.5 text-base",
  sm: "min-h-10 px-5 py-[7px] text-sm",
};

const variants: Record<Variant, string> = {
  /** btn--primary: гол үйлдэл (захиалга) — taupe */
  primary: "bg-taupe text-ink hover:bg-taupe-hover",
  /** Цайвар (beige) дэвсгэр дээрх гол үйлдэл — хамгийн өндөр тодрол */
  dark: "bg-ink text-on-dark hover:bg-brown",
  /** btn--dark: цайвар дэвсгэр дээрх хоёрдогч, outline */
  secondary: "text-ink shadow-[inset_0_0_0_1px_var(--color-ink)] hover:bg-ink/[0.08]",
  /** btn--ghost: бараан, зураг дээрх хоёрдогч */
  glass: "text-on-dark shadow-[inset_0_0_0_1px_rgb(255_255_255/0.6)] hover:bg-white/[0.12]",
  /** btn--light: бараан, зураг дээрх гол үйлдэл */
  "outline-light": "bg-paper text-ink hover:bg-[color-mix(in_srgb,var(--color-paper)_85%,var(--color-ink))]",
  link: "group px-1 text-ink",
  /** Бараан дэвсгэр дээрх холбоос */
  "link-light": "group px-1 text-on-dark",
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

/** Товчны class — <button> дээр ч ижил харагдуулахад ашиглана. */
export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  const isLink = variant === "link" || variant === "link-light";
  return cn(base, isLink ? "min-h-[46px] text-base" : sizes[size], variants[variant], className);
}

/** Сайт доторх холбоос бол next/link, гадаад холбоос бол шинэ цонхонд нээгдэх <a> болно. */
export function Button({ href, children, variant = "primary", size = "md", arrow, className, onClick }: ButtonProps) {
  const classes = buttonClass(variant, size, className);
  const content = (
    <>
      {children}
      {arrow && (
        <span aria-hidden="true" className="transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-1">
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
