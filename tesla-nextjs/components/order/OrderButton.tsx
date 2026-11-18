"use client";

import { useFormStatus } from "react-dom";
import { startCheckout } from "@/app/order/actions";
import { Button, buttonClass, type Size, type Variant } from "@/components/ui/Button";

export type OrderInfo = { slug: string; url: string; deposit?: number };

type Props = {
  order: OrderInfo;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

/**
 * Урьдчилгаатай загвар бол Byl-ээр төлүүлэх маягт (Server Action), үгүй бол энгийн холбоос.
 * Энгийн <form> тул JavaScript ачаалагдаагүй байсан ч ажиллана.
 */
export function OrderButton({ order, children, variant = "primary", size = "md", className }: Props) {
  if (!order.deposit) {
    return (
      <Button href={order.url} variant={variant} size={size} className={className}>
        {children}
      </Button>
    );
  }

  return (
    <form action={startCheckout}>
      <input type="hidden" name="slug" value={order.slug} />
      <Submit className={buttonClass(variant, size, className)}>{children}</Submit>
    </form>
  );
}

function Submit({ className, children }: { className: string; children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`${className} disabled:opacity-60`}>
      {pending ? "Төлбөр рүү шилжиж байна…" : children}
    </button>
  );
}
