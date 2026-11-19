import { createHmac, timingSafeEqual } from "node:crypto";
import { CAL_MODEL_FIELD } from "@/lib/cal";

/**
 * Cal.com webhook — зөвхөн сервер дээр.
 * Орчны хувьсагч: CAL_WEBHOOK_SECRET (Cal.com → Settings → Developer → Webhooks дээр оруулсан secret).
 */

/** x-cal-signature-256 = HMAC-SHA256(secret, түүхий бие) hex */
export function verifyCalSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"));
  const received = Buffer.from(signature.trim());
  return expected.length === received.length && timingSafeEqual(expected, received);
}

type Response<T> = { label?: string; value?: T } | undefined;

/** Бидэнд хэрэгтэй хэсэг (webhook version 2021-10-20) */
export type CalWebhookEvent = {
  triggerEvent: string;
  payload?: {
    uid?: string;
    startTime?: string;
    endTime?: string;
    rescheduleUid?: string;
    metadata?: Record<string, unknown>;
    attendees?: { name?: string; email?: string; phoneNumber?: string | null }[];
    responses?: Record<string, Response<unknown>>;
  };
};

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);

/** Webhook-ийн payload-аас машин болон захиалагчийн мэдээллийг гаргана. */
export function readBooking(payload: NonNullable<CalWebhookEvent["payload"]>) {
  const responses = payload.responses ?? {};
  const attendee = payload.attendees?.[0];
  return {
    modelSlug: text(payload.metadata?.model),
    modelName: text(responses[CAL_MODEL_FIELD]?.value),
    name: text(responses.name?.value) ?? text(attendee?.name),
    email: text(responses.email?.value) ?? text(attendee?.email),
    phone: text(responses.attendeePhoneNumber?.value) ?? text(attendee?.phoneNumber),
  };
}
