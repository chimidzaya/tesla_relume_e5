import { readBooking, verifyCalSignature, type CalWebhookEvent } from "@/lib/cal-webhook";
import { createSupabaseAdminClient, type TestDriveRow } from "@/lib/supabase-admin";
import { confirmCalBooking, HOLD_MINUTES, modelNameFor } from "@/lib/test-drive";

/**
 * POST /api/cal/webhook — Cal.com-оос туршилтын жолоодлогын үйл явдал ирнэ.
 *
 * - BOOKING_REQUESTED   цаг сонгогдлоо («Requires confirmation») → төлбөр хүлээж буй, HOLD_MINUTES хугацаатай
 * - BOOKING_CREATED     баталгаажлаа (бид төлбөрийн дараа Cal API-аар баталгаажуулахад ирнэ)
 * - BOOKING_RESCHEDULED цагаа өөрчиллөө → шинэ uid, төлбөр нь шинэ цаг руу шилжинэ
 * - BOOKING_CANCELLED   хэрэглэгч цуцаллаа
 * - BOOKING_REJECTED    татгалзсан (төлөөгүй тул бид татгалзсан)
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyCalSignature(raw, request.headers.get("x-cal-signature-256"))) {
    return Response.json({ ok: false, message: "Invalid signature" }, { status: 401 });
  }

  let event: CalWebhookEvent;
  try {
    event = JSON.parse(raw) as CalWebhookEvent;
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const payload = event.payload;
  const handled = ["BOOKING_REQUESTED", "BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED", "BOOKING_REJECTED"];
  // PING (Cal.com-ын «Ping test») болон бусад event-ийг хүлээн авснаа мэдэгдээд орхино
  if (!handled.includes(event.triggerEvent) || !payload?.uid) {
    return Response.json({ ok: true, ignored: event.triggerEvent });
  }

  const db = createSupabaseAdminClient();
  const now = new Date().toISOString();
  const uid = payload.uid;

  try {
    switch (event.triggerEvent) {
      case "BOOKING_CANCELLED": {
        await check(db.from("test_drives").update({ status: "cancelled", updated_at: now }).eq("booking_uid", uid));
        break;
      }
      case "BOOKING_REJECTED": {
        await check(
          db.from("test_drives").update({ status: "expired", updated_at: now }).eq("booking_uid", uid).eq("status", "pending_payment"),
        );
        break;
      }
      case "BOOKING_CREATED": {
        // Мөр байвал баталгаажсан болгоно; байхгүй бол (баталгаажуулалтгүй event) шууд бүртгэнэ
        const { data } = await db
          .from("test_drives")
          .update({ status: "confirmed", expires_at: null, updated_at: now })
          .eq("booking_uid", uid)
          .in("status", ["pending_payment", "confirmed"])
          .select("booking_uid");
        if (!data?.length) await insertBooking(event, "confirmed");
        break;
      }
      case "BOOKING_REQUESTED":
      case "BOOKING_RESCHEDULED": {
        const previous = payload.rescheduleUid ? await moveFrom(payload.rescheduleUid) : null;
        if (previous?.paid_at) {
          // Төлсөн хүн цагаа өөрчилсөн — дахин төлүүлэхгүй, шинэ цагийг шууд баталгаажуулна
          await insertBooking(event, "confirmed", previous);
          if (event.triggerEvent === "BOOKING_REQUESTED") await confirmCalBooking(uid);
        } else {
          await insertBooking(event, "pending_payment", previous);
        }
        break;
      }
    }
  } catch (error) {
    // 500 буцаавал Cal дахин оролдоно
    console.error("[cal] webhook:", error instanceof Error ? error.message : error);
    return Response.json({ ok: false }, { status: 500 });
  }

  console.log(`[cal] ${event.triggerEvent}: ${uid}`);
  return Response.json({ ok: true });
}

type Previous = Pick<TestDriveRow, "model_slug" | "model_name" | "order_id" | "paid_at">;

async function check(query: PromiseLike<{ error: { message: string } | null }>) {
  const { error } = await query;
  if (error) throw new Error(error.message);
}

/** Хуучин захиалгыг «цаг өөрчилсөн» болгож, машин + төлбөрийн мэдээллийг нь буцаана */
async function moveFrom(oldUid: string): Promise<Previous | null> {
  const { data } = await createSupabaseAdminClient()
    .from("test_drives")
    .update({ status: "rescheduled", updated_at: new Date().toISOString() })
    .eq("booking_uid", oldUid)
    .select("model_slug, model_name, order_id, paid_at")
    .maybeSingle<Previous>();
  return data;
}

/** upsert — Cal нэг event-ийг дахин илгээсэн ч давхардахгүй, төлөвийг ухраахгүй */
async function insertBooking(event: CalWebhookEvent, status: TestDriveRow["status"], previous?: Previous | null) {
  const payload = event.payload!;
  const booking = readBooking(payload);
  const modelSlug = booking.modelSlug ?? previous?.model_slug ?? null;
  const modelName = booking.modelName ?? previous?.model_name ?? (await modelNameFor(modelSlug));

  await check(
    createSupabaseAdminClient()
      .from("test_drives")
      .upsert(
        {
          booking_uid: payload.uid,
          model_slug: modelSlug,
          model_name: modelName,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          start_time: payload.startTime,
          end_time: payload.endTime ?? null,
          status,
          expires_at: status === "pending_payment" ? new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString() : null,
          order_id: previous?.order_id ?? null,
          paid_at: previous?.paid_at ?? null,
          rescheduled_from: payload.rescheduleUid ?? null,
        },
        { onConflict: "booking_uid", ignoreDuplicates: true },
      ),
  );
}
