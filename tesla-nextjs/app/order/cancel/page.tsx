import type { Metadata } from "next";
import { OrderResult } from "@/components/order/OrderResult";
import { Button } from "@/components/ui/Button";
import { getModel } from "@/data/models";

export const metadata: Metadata = { title: "Захиалга цуцлагдлаа", robots: { index: false } };

/** Byl дээр «Цуцлах» дарсан, эсвэл төлбөрийн хуудас үүсгэхэд алдаа гарсан үед. */
export default async function OrderCancelPage({ searchParams }: PageProps<"/order/cancel">) {
  const { model: slug, error } = await searchParams;
  const model = typeof slug === "string" ? await getModel(slug) : undefined;
  const failed = error === "1";

  return (
    <OrderResult
      eyebrow="Захиалга"
      title={failed ? "Төлбөрийн хуудас нээгдсэнгүй" : "Төлбөр цуцлагдлаа"}
      actions={
        <>
          {model && (
            <Button href={`/models/${model.slug}`} variant="outline-light">
              {model.name} руу буцах
            </Button>
          )}
          <Button href="/" variant="glass">
            Нүүр хуудас
          </Button>
        </>
      }
    >
      <p>
        {failed
          ? "Түр зуурын алдаа гарлаа. Хэсэг хүлээгээд дахин оролдоно уу. Мөнгө хасагдаагүй."
          : "Таны данснаас мөнгө хасагдаагүй. Хүссэн үедээ дахин захиалж болно."}
      </p>
    </OrderResult>
  );
}
