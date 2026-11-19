import { getModels } from "@/data/models";
import { readBooking, verifyCalSignature, type CalWebhookEvent } from "@/lib/cal-webhook";
import { createSupabaseAdminClient, type TestDriveRow } from "@/lib/supabase-admin";

/**
 * POST /api/cal/webhook — Cal.com-оос туршилтын жолоодлогын захиалга үүсэх, цаг өөрчлөх, цуцлахад мэдэгдэл ирнэ.
 * Захиалга бүрийг аль машинд хамаарахтай нь (metadata[model]) `test_drives` хүснэгтэд хадгална.
 */
export async function POST(request: Request) {
  // Гарын үсгийг түүхий биеэр шалгана
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
  const handled = ["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED"];
  // PING (Cal.com-ын «Ping test») болон бусад event-ийг хүлээн авснаа мэдэгдээд орхино
  if (!handled.includes(event.triggerEvent) || !payload?.uid) {
    return Response.json({ ok: true, ignored: event.triggerEvent });
  }

  const db = createSupabaseAdminClient();
  const now = new Date().toISOString();

  if (event.triggerEvent === "BOOKING_CANCELLED") {
    const { error } = await db.from("test_drives").update({ status: "cancelled", updated_at: now }).eq("booking_uid", payload.uid);
    if (error) return fail(error.message);
    return Response.json({ ok: true });
  }

  const booking = readBooking(payload);

  // Цаг өөрчлөхөд Cal шинэ uid үүсгэдэг; metadata ирээгүй бол хуучин захиалгаас машиныг өвлүүлнэ
  let previous: Pick<TestDriveRow, "model_slug" | "model_name"> | null = null;
  if (event.triggerEvent === "BOOKING_RESCHEDULED" && payload.rescheduleUid) {
    const { data } = await db
      .from("test_drives")
      .update({ status: "rescheduled", updated_at: now })
      .eq("booking_uid", payload.rescheduleUid)
      .select("model_slug, model_name")
      .maybeSingle();
    previous = data;
  }

  const modelSlug = booking.modelSlug ?? previous?.model_slug ?? null;
  let modelName = booking.modelName ?? previous?.model_name ?? null;
  if (modelSlug && !modelName) {
    modelName = (await getModels()).find((m) => m.slug === modelSlug)?.name ?? null;
  }

  // upsert — Cal нэг event-ийг дахин илгээсэн ч давхардахгүй
  const { error } = await db.from("test_drives").upsert(
    {
      booking_uid: payload.uid,
      model_slug: modelSlug,
      model_name: modelName,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      start_time: payload.startTime,
      end_time: payload.endTime ?? null,
      status: "booked",
      rescheduled_from: payload.rescheduleUid ?? null,
      updated_at: now,
    },
    { onConflict: "booking_uid" },
  );
  if (error) return fail(error.message);

  console.log(`[cal] ${event.triggerEvent}: ${modelName ?? "машин тодорхойгүй"} · ${payload.startTime}`);
  return Response.json({ ok: true });
}

/** 500 буцаавал Cal дахин оролдоно */
function fail(message: string) {
  console.error("[cal] webhook:", message);
  return Response.json({ ok: false }, { status: 500 });
}
