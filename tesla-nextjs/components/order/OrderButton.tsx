import { Button, type Size, type Variant } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";

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
 * Гол үйлдэл тул magnetic — хулгана ойртоход татагдана.
 */
export function OrderButton({ order, children, variant = "primary", size = "md", className }: Props) {
  const deposit = Boolean(order.deposit);

  return (
    <Magnetic className={className}>
      <Button
        href={deposit ? `/order/${order.slug}` : order.url}
        variant={variant}
        size={size}
        arrow={deposit}
      >
        {children}
      </Button>
    </Magnetic>
  );
}
