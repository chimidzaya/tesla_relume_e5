import type { Metadata } from "next";
import { OrderResult } from "@/components/order/OrderResult";
import { Button } from "@/components/ui/Button";
import { formatMNT } from "@/lib/format";
import { createSupabaseAdminClient, type OrderRow } from "@/lib/supabase-admin";

export const metadata: Metadata = { title: "Захиалга", robots: { index: false } };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Byl-ээс буцаж ирэх хуудас. Төлөгдсөн эсэхийг URL-аас биш, webhook-ийн бичсэн database-ээс уншина.
 * Webhook хэдэн секунд хоцорч болох тул «баталгаажиж байна» төлөв бий.
 */
export default async function OrderSuccessPage({ searchParams }: PageProps<"/order/success">) {
  const { id } = await searchParams;
  let order: Pick<OrderRow, "id" | "model_name" | "amount" | "status"> | null = null;

  if (typeof id === "string" && UUID.test(id)) {
    const { data } = await createSupabaseAdminClient()
      .from("orders")
      .select("id, model_name, amount, status")
      .eq("id", id)
      .maybeSingle();
    order = data;
  }

  if (!order) {
    return (
      <OrderResult eyebrow="Захиалга" title="Захиалга олдсонгүй" actions={<Button href="/">Нүүр хуудас</Button>}>
        <p>Холбоос буруу эсвэл хугацаа нь дууссан байна.</p>
      </OrderResult>
    );
  }

  const paid = order.status === "complete";
  const ref = order.id.slice(0, 8).toUpperCase();

  return (
    <OrderResult
      eyebrow={`Захиалга № ${ref}`}
      title={paid ? "Баярлалаа! Төлбөр амжилттай" : "Төлбөр баталгаажиж байна"}
      actions={
        <>
          {!paid && (
            <Button href={`/order/success?id=${order.id}`} variant="outline-light">
              Дахин шалгах
            </Button>
          )}
          <Button href="/" variant={paid ? "outline-light" : "glass"}>
            Нүүр хуудас
          </Button>
        </>
      }
    >
      <p>
        Tesla {order.model_name} — урьдчилгаа <span className="text-on-dark">{formatMNT(order.amount)}</span>
      </p>
      <p>
        {paid
          ? "Таны захиалга бүртгэгдлээ. Баримт и-мэйлээр ирнэ, манай ажилтан тантай удахгүй холбогдоно."
          : "Byl-ээс баталгаа ирэхийг хүлээж байна. Хэдэн секундийн дараа «Дахин шалгах» дарна уу."}
      </p>
    </OrderResult>
  );
}
