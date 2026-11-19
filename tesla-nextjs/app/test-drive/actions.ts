"use server";

import { redirect } from "next/navigation";
import { createCheckout } from "@/lib/byl";
import { siteOrigin } from "@/lib/site-origin";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { extendHold, loadTestDrive, TEST_DRIVE_FEE } from "@/lib/test-drive";

/**
 * «20,000₮ төлөх» → Byl-ийн захиалга үүсгээд төлбөрийн хуудас руу шилжүүлнэ.
 * Дүн серверийн тогтмолоос; цаг нь төлбөр хүлээж буй, хугацаа нь дуусаагүй байх ёстой.
 */
export async function startTestDrivePayment(formData: FormData) {
  const uid = String(formData.get("uid") ?? "");
  const back = `/test-drive/${encodeURIComponent(uid)}`;

  const drive = await loadTestDrive(uid);
  // Хугацаа дууссан, цуцлагдсан, аль хэдийн төлсөн бол хуудас өөрөө тохирох төлөвийг харуулна
  if (drive?.status !== "pending_payment") redirect(back);

  let checkoutUrl: string;
  try {
    const db = createSupabaseAdminClient();
    const modelName = drive.model_name ?? "Tesla";
    const { data: order, error } = await db
      .from("orders")
      .insert({
        kind: "test_drive",
        booking_uid: drive.booking_uid,
        model_slug: drive.model_slug ?? "test-drive",
        model_name: modelName,
        amount: TEST_DRIVE_FEE,
      })
      .select("id")
      .single<{ id: string }>();
    if (error || !order) throw new Error(error?.message ?? "Захиалга үүссэнгүй");

    const origin = await siteOrigin();
    const checkout = await createCheckout({
      amount: TEST_DRIVE_FEE,
      productName: `Tesla ${modelName} — туршилтын жолоодлого`,
      productRef: "test-drive",
      orderId: order.id,
      successUrl: `${origin}${back}?paid=1`,
      cancelUrl: `${origin}${back}?cancelled=1`,
    });

    await db.from("orders").update({ byl_checkout_id: checkout.id }).eq("id", order.id);
    // Byl-ийн хуудсанд байх хооронд цаг цуцлагдахгүй
    await extendHold(drive.booking_uid, order.id);
    checkoutUrl = checkout.url;
  } catch (error) {
    console.error("[test-drive] checkout:", error);
    redirect(`${back}?error=1`);
  }

  redirect(checkoutUrl);
}
