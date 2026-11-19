import { timingSafeEqual } from "node:crypto";
import { expireOverdue } from "@/lib/test-drive";

/**
 * GET /api/test-drive/expire — төлбөрийн хугацаа дууссан туршилтын жолоодлогыг цуцлана.
 * Supabase pg_cron 5 минут тутам `Authorization: Bearer CRON_SECRET`-тэй дуудна.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  if (!secret || expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const expired = await expireOverdue();
  if (expired) console.log(`[test-drive] ${expired} захиалга төлөгдөөгүй тул цуцлагдлаа.`);
  return Response.json({ ok: true, expired });
}
