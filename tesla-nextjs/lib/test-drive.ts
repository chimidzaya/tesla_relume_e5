import { getModels } from "@/data/models";
import { HOLD_MINUTES, TEST_DRIVE_FEE } from "@/lib/cal";
import { createSupabaseAdminClient, type TestDriveRow } from "@/lib/supabase-admin";

/**
 * Туршилтын жолоодлогын төлбөрийн логик — зөвхөн сервер дээр.
 * Орчны хувьсагч: CAL_API_KEY (Cal.com → Settings → Developer → API keys, cal_ угтвартай).
 *
 * Төлөвүүд:
 *   pending_payment → (Byl төлөгдөв) → confirmed
 *   pending_payment → (HOLD_MINUTES өнгөрөв) → expired   (Cal дээр татгалзаж, цагийг чөлөөлнө)
 *   confirmed → cancelled / rescheduled                 (хэрэглэгч Cal-ын имэйлээс өөрчилсөн)
 *   expired/cancelled үед төлбөр орвол → refund_needed   (admin гараар буцаана)
 */

export { HOLD_MINUTES, TEST_DRIVE_FEE };
/** Byl-ийн хуудсанд орсон хэрэглэгчид төлж дуусгах нэмэлт хугацаа */
const PAY_WINDOW_MINUTES = 15;

const CAL_API = "https://api.cal.com/v2";
const CAL_API_VERSION = "2026-02-25";

const minutesFromNow = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString();

async function calFetch(path: string, init?: { method?: string; body?: unknown }) {
  const key = process.env.CAL_API_KEY;
  if (!key) throw new Error("CAL_API_KEY тохируулагдаагүй байна.");
  const response = await fetch(`${CAL_API}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      "cal-api-version": CAL_API_VERSION,
      ...(init?.body !== undefined && { "Content-Type": "application/json" }),
    },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const json = (await response.json().catch(() => null)) as { data?: unknown; error?: { message?: string } } | null;
  if (!response.ok) throw new Error(`Cal API ${path} (${response.status}): ${json?.error?.message ?? "хариу алга"}`);
  return json?.data;
}

/** Хүлээгдэж буй захиалгыг баталгаажуулна — Cal хэрэглэгчид баталгаажсан имэйл илгээнэ */
export const confirmCalBooking = (uid: string) => calFetch(`/bookings/${uid}/confirm`, { method: "POST" });

/** Хүлээгдэж буй захиалгыг татгалзана — цаг бусдад нээгдэнэ */
export const declineCalBooking = (uid: string, reason: string) =>
  calFetch(`/bookings/${uid}/decline`, { method: "POST", body: { reason } });

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);

/** slug-аас машины нэр (Cal-ын «Машин» асуулт хоосон ирвэл) */
export async function modelNameFor(slug: string | null) {
  if (!slug) return null;
  return (await getModels()).find((m) => m.slug === slug)?.name ?? null;
}

type CalBooking = {
  uid: string;
  status: string;
  start: string;
  end?: string;
  metadata?: Record<string, unknown>;
  bookingFieldsResponses?: Record<string, unknown>;
  attendees?: { name?: string; email?: string; phoneNumber?: string | null }[];
};

/**
 * Database-д байхгүй захиалгыг Cal API-аас уншиж хадгална. Хэрэглэгч Cal-аас манай төлбөрийн
 * хуудас руу webhook-оос түрүүлж ирэх тохиолдолд хэрэгтэй.
 */
async function syncFromCal(uid: string): Promise<TestDriveRow | null> {
  let booking: CalBooking;
  try {
    booking = (await calFetch(`/bookings/${uid}`)) as CalBooking;
  } catch (error) {
    console.error("[test-drive] sync:", error);
    return null;
  }
  if (!booking?.uid) return null;

  const fields = booking.bookingFieldsResponses ?? {};
  const attendee = booking.attendees?.[0];
  const slug = text(booking.metadata?.model);
  const status: TestDriveRow["status"] =
    booking.status === "pending" ? "pending_payment" : booking.status === "accepted" ? "confirmed" : "cancelled";

  const { data } = await createSupabaseAdminClient()
    .from("test_drives")
    .upsert(
      {
        booking_uid: booking.uid,
        model_slug: slug,
        model_name: text(fields.model) ?? (await modelNameFor(slug)),
        name: text(fields.name) ?? text(attendee?.name),
        email: text(fields.email) ?? text(attendee?.email),
        phone: text(fields.attendeePhoneNumber) ?? text(attendee?.phoneNumber),
        start_time: booking.start,
        end_time: booking.end ?? null,
        status,
        expires_at: status === "pending_payment" ? minutesFromNow(HOLD_MINUTES) : null,
      },
      // webhook түрүүлж бичсэн бол түүнийг нь хэвээр үлдээнэ
      { onConflict: "booking_uid", ignoreDuplicates: true },
    )
    .select("*")
    .maybeSingle<TestDriveRow>();
  return data ?? (await readTestDrive(uid));
}

async function readTestDrive(uid: string) {
  const { data } = await createSupabaseAdminClient()
    .from("test_drives")
    .select("*")
    .eq("booking_uid", uid)
    .maybeSingle<TestDriveRow>();
  return data;
}

/** Төлбөрийн хуудсанд: database → (байхгүй бол) Cal API. Хугацаа хэтэрсэн бол тэр дор нь цуцална. */
export async function loadTestDrive(uid: string): Promise<TestDriveRow | null> {
  const row = (await readTestDrive(uid)) ?? (await syncFromCal(uid));
  if (row?.status === "pending_payment" && row.expires_at && new Date(row.expires_at) < new Date()) {
    await expireOne(row.booking_uid);
    return readTestDrive(uid);
  }
  return row;
}

/** Byl-ийн хуудас руу орохдоо төлж дуусгах хугацааг сунгана (хуудсан дээр байх хооронд цаг цуцлагдахгүй) */
export async function extendHold(uid: string, orderId: string) {
  const row = await readTestDrive(uid);
  const extended = minutesFromNow(PAY_WINDOW_MINUTES);
  const expiresAt = row?.expires_at && row.expires_at > extended ? row.expires_at : extended;
  await createSupabaseAdminClient()
    .from("test_drives")
    .update({ expires_at: expiresAt, order_id: orderId, updated_at: new Date().toISOString() })
    .eq("booking_uid", uid)
    .eq("status", "pending_payment");
}

/** Нэг захиалгыг цуцлах: эхлээд database-д түгжинэ (давхар ажиллахаас сэргийлнэ), дараа нь Cal дээр татгалзана */
async function expireOne(uid: string) {
  const { data } = await createSupabaseAdminClient()
    .from("test_drives")
    .update({ status: "expired", updated_at: new Date().toISOString() })
    .eq("booking_uid", uid)
    .eq("status", "pending_payment")
    .select("booking_uid");
  if (!data?.length) return false;
  try {
    await declineCalBooking(uid, `Туршилтын жолоодлогын төлбөр ${HOLD_MINUTES} минутын дотор төлөгдөөгүй тул цаг цуцлагдлаа.`);
  } catch (error) {
    // Cal дээр аль хэдийн цуцлагдсан байж болно — database-д expired хэвээр
    console.error("[test-drive] decline:", error);
  }
  return true;
}

/** Хугацаа нь дууссан бүх захиалгыг цуцална (Supabase pg_cron 5 минут тутам дуудна) */
export async function expireOverdue() {
  const { data } = await createSupabaseAdminClient()
    .from("test_drives")
    .select("booking_uid")
    .eq("status", "pending_payment")
    .lt("expires_at", new Date().toISOString())
    .limit(50);
  let expired = 0;
  for (const row of data ?? []) if (await expireOne(row.booking_uid)) expired++;
  return expired;
}

/**
 * Byl-ийн webhook: туршилтын жолоодлогын төлбөр орлоо → Cal дээр баталгаажуулна.
 * Дахин дуудагдсан ч аюулгүй (idempotent).
 */
export async function markTestDrivePaid(uid: string, orderId: string) {
  const db = createSupabaseAdminClient();
  const row = await readTestDrive(uid);
  if (!row || row.status === "confirmed") return;

  const now = new Date().toISOString();
  if (row.status !== "pending_payment") {
    // Хугацаа дууссаны дараа эсвэл цуцалсны дараа төлсөн — цаг нь баталгаагүй, мөнгийг буцаана
    await db.from("test_drives").update({ status: "refund_needed", order_id: orderId, paid_at: now, updated_at: now }).eq("booking_uid", uid);
    console.warn(`[test-drive] ${uid}: ${row.status} төлөвтэй үед төлбөр орсон — буцаалт хэрэгтэй.`);
    return;
  }

  try {
    await confirmCalBooking(uid);
  } catch (error) {
    // Өмнөх оролдлогоор Cal дээр баталгаажсан байж болно — тийм бол үргэлжлүүлнэ,
    // үгүй бол алдааг шиднэ → Byl webhook 500 буцааж, дахин оролдуулна
    const booking = (await calFetch(`/bookings/${uid}`).catch(() => null)) as CalBooking | null;
    if (booking?.status !== "accepted") throw error;
  }
  await db
    .from("test_drives")
    .update({ status: "confirmed", order_id: orderId, paid_at: now, expires_at: null, updated_at: now })
    .eq("booking_uid", uid);
}
