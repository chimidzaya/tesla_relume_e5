import type { Metadata } from "next";
import { AutoRefresh } from "@/components/order/AutoRefresh";
import { OrderResult, Receipt, StatusIcon } from "@/components/order/OrderResult";
import { OrderSteps } from "@/components/order/OrderSteps";
import { Button } from "@/components/ui/Button";
import { formatMNT } from "@/lib/format";
import { createSupabaseAdminClient, type OrderRow } from "@/lib/supabase-admin";

export const metadata: Metadata = { title: "Захиалга", robots: { index: false } };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const dateFormat = new Intl.DateTimeFormat("mn-MN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ulaanbaatar",
});

/**
 * Алхам 3 — баталгаажилт (Norman: perceive → interpret → compare).
 * Төлөгдсөн эсэхийг URL-аас биш, webhook-ийн бичсэн database-ээс уншина.
 * Хүлээгдэж буй үед хуудас өөрөө шинэчлэгдэнэ.
 */
export default async function OrderSuccessPage({ searchParams }: PageProps<"/order/success">) {
  const { id } = await searchParams;
  let order: Pick<OrderRow, "id" | "model_slug" | "model_name" | "amount" | "status" | "created_at" | "paid_at"> | null =
    null;

  if (typeof id === "string" && UUID.test(id)) {
    const { data } = await createSupabaseAdminClient()
      .from("orders")
      .select("id, model_slug, model_name, amount, status, created_at, paid_at")
      .eq("id", id)
      .maybeSingle();
    order = data;
  }

  if (!order) {
    return (
      <OrderResult
        icon={<StatusIcon status="stopped" />}
        eyebrow="Захиалга"
        title="Захиалга олдсонгүй"
        actions={<Button href="/">Нүүр хуудас</Button>}
      >
        <p>Холбоос буруу эсвэл хугацаа нь дууссан байна. Төлбөр төлсөн бол бидэнтэй холбогдоно уу.</p>
      </OrderResult>
    );
  }

  const paid = order.status === "complete";
  const ref = order.id.slice(0, 8).toUpperCase();

  return (
    <OrderResult
      steps={<OrderSteps current={2} state={paid ? "done" : "active"} />}
      icon={<StatusIcon status={paid ? "paid" : "pending"} />}
      eyebrow={paid ? "Төлбөр баталгаажлаа" : "Төлбөр шалгагдаж байна"}
      title={paid ? `Баярлалаа! ${order.model_name} таны дараалалд орлоо` : "Төлбөрийг баталгаажуулж байна"}
      actions={
        paid ? (
          <>
            <Button href={`/models/${order.model_slug}`} variant="outline-light">
              {order.model_name}-ийг дахин үзэх
            </Button>
            <Button href="/" variant="glass">
              Нүүр хуудас
            </Button>
          </>
        ) : (
          <>
            <Button href={`/order/success?id=${order.id}`} variant="outline-light">
              Дахин шалгах
            </Button>
            <Button href="/" variant="glass">
              Нүүр хуудас
            </Button>
          </>
        )
      }
    >
      {!paid && <AutoRefresh />}

      <Receipt
        rows={[
          { label: "Захиалгын дугаар", value: <span className="font-mono tracking-wide">{ref}</span> },
          { label: "Загвар", value: `Tesla ${order.model_name}` },
          { label: "Урьдчилгаа", value: <span className="font-semibold tabular-nums">{formatMNT(order.amount)}</span> },
          { label: "Огноо", value: dateFormat.format(new Date(order.paid_at ?? order.created_at)) },
          {
            label: "Төлөв",
            value: paid ? (
              <span className="rounded-full bg-[#3f8a4a] px-2.5 py-1 text-xs font-medium text-white">Төлөгдсөн</span>
            ) : (
              <span className="rounded-full bg-taupe px-2.5 py-1 text-xs font-medium text-ink">Хүлээгдэж буй</span>
            ),
          },
        ]}
      />

      <p>
        {paid
          ? "Баримт таны и-мэйлд ирнэ. Манай ажилтан 1 ажлын өдөрт багтаан холбогдож өнгө, хүргэлтийн хугацааг тохирно. Захиалгын дугаараа хадгалаарай."
          : "Ихэвчлэн хэдхэн секунд болдог. Энэ хуудсыг хааж болно — төлбөр орсон бол захиалга тань бүртгэгдсэн хэвээр байна."}
      </p>
    </OrderResult>
  );
}
