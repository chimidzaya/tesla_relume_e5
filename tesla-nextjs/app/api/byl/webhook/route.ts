import { verifyWebhookSignature, type BylWebhookEvent } from "@/lib/byl";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { markTestDrivePaid } from "@/lib/test-drive";

/**
 * POST /api/byl/webhook — Byl төлбөр төлөгдөхөд энд мэдэгдэл (checkout.completed) илгээнэ.
 * Захиалгыг «төлөгдсөн» болгох цорын ганц газар (success хуудсыг хэрэглэгч хааж болзошгүй).
 */
export async function POST(request: Request) {
  // Гарын үсгийг түүхий биеэр шалгана — JSON болгож буцааж stringify хийвэл таарахгүй.
  const raw = await request.text();
  if (!verifyWebhookSignature(raw, request.headers.get("byl-signature"))) {
    return Response.json({ ok: false, message: "Invalid signature" }, { status: 401 });
  }

  let event: BylWebhookEvent;
  try {
    event = JSON.parse(raw) as BylWebhookEvent;
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const checkout = event.data?.object;
  // Бусад event-ийг хүлээн авснаа мэдэгдээд орхино (Byl дахин илгээхгүй).
  if (event.type !== "checkout.completed" || !checkout?.client_reference_id) {
    return Response.json({ ok: true, ignored: event.type });
  }

  const db = createSupabaseAdminClient();
  const { error } = await db
    .from("orders")
    .update({
      status: "complete",
      paid_at: new Date().toISOString(),
      paid_amount: Number(checkout.amount_total),
      byl_checkout_id: checkout.id,
      customer_email: checkout.customer_email,
      phone: checkout.phone_number ?? null,
    })
    .eq("id", checkout.client_reference_id)
    // Нэг event хоёр ирвэл дахин бичихгүй
    .neq("status", "complete");

  if (error) {
    console.error("[byl] webhook:", error.message);
    // 500 буцаавал Byl дахин оролдоно
    return Response.json({ ok: false }, { status: 500 });
  }

  // Туршилтын жолоодлогын төлбөр бол Cal дээрх цагийг баталгаажуулна.
  // Дахин ирсэн event-д ч (захиалга аль хэдийн complete) энэ алхмыг давтана — баталгаажилт амжаагүй байж болно.
  const { data: order } = await db
    .from("orders")
    .select("id, kind, booking_uid")
    .eq("id", checkout.client_reference_id)
    .maybeSingle<{ id: string; kind: string; booking_uid: string | null }>();
  if (order?.kind === "test_drive" && order.booking_uid) {
    try {
      await markTestDrivePaid(order.booking_uid, order.id);
    } catch (confirmError) {
      console.error("[byl] туршилтын жолоодлого баталгаажсангүй:", confirmError);
      return Response.json({ ok: false }, { status: 500 });
    }
  }

  console.log(`[byl] Захиалга ${checkout.client_reference_id} төлөгдлөө (checkout ${checkout.id}).`);
  return Response.json({ ok: true });
}
