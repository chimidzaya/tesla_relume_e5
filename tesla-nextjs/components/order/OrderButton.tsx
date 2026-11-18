import { Button, type Size, type Variant } from "@/components/ui/Button";

export type OrderInfo = { slug: string; url: string; deposit?: number };

type Props = {
  order: OrderInfo;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

/**
 * Урьдчилгаатай загвар → эхлээд /order/[slug] шалгах хуудас (шууд мөнгө авахгүй),
 * үгүй бол admin-д бүртгэсэн гадаад холбоос. Сум (→) нь «дараагийн алхам руу» гэсэн signifier.
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
    <Button href={`/order/${order.slug}`} variant={variant} size={size} className={className} arrow>
      {children}
    </Button>
  );
}
