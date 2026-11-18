import type { Metadata } from "next";
import { OrderResult, StatusIcon } from "@/components/order/OrderResult";
import { OrderSteps } from "@/components/order/OrderSteps";
import { Button } from "@/components/ui/Button";
import { getModel } from "@/data/models";

export const metadata: Metadata = { title: "Төлбөр цуцлагдлаа", robots: { index: false } };

/**
 * Byl дээр «Буцах / Цуцлах» дарсан үед. Хэрэглэгчид 3 зүйлийг тод хэлнэ:
 * юу болсон (зогссон), мөнгө хасагдаагүй, дахин яаж оролдох.
 */
export default async function OrderCancelPage({ searchParams }: PageProps<"/order/cancel">) {
  const { model: slug } = await searchParams;
  const model = typeof slug === "string" ? await getModel(slug) : undefined;

  return (
    <OrderResult
      steps={<OrderSteps current={1} state="stopped" />}
      icon={<StatusIcon status="stopped" />}
      eyebrow="Төлбөр хийгдээгүй"
      title="Төлбөр цуцлагдлаа"
      actions={
        <>
          {model?.deposit && (
            <Button href={`/order/${model.slug}`} variant="outline-light" arrow>
              Дахин оролдох
            </Button>
          )}
          <Button href={model ? `/models/${model.slug}` : "/"} variant="glass">
            {model ? `${model.name} руу буцах` : "Нүүр хуудас"}
          </Button>
        </>
      }
    >
      <p>
        <span className="text-on-dark">Таны данснаас мөнгө хасагдаагүй.</span> Захиалга хадгалагдаагүй тул хүссэн үедээ
        дахин эхлүүлж болно.
      </p>
    </OrderResult>
  );
}
