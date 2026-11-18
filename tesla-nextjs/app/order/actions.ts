"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createCheckout } from "@/lib/byl";
import { supabase } from "@/lib/supabase";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

/** Сайтын хаяг (Vercel дээр https://…vercel.app, локалд http://localhost:3000) */
async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * «Захиалах» → захиалга үүсгээд Byl-ийн төлбөрийн хуудас руу шилжүүлнэ.
 * Дүнг хөтчөөс биш, database-ээс уншина (хэрэглэгч өөрчилж чадахгүй).
 */
export async function startCheckout(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");

  const { data: model } = await supabase
    .from("models")
    .select("slug, name, deposit_amount")
    .eq("slug", slug)
    .maybeSingle<{ slug: string; name: string; deposit_amount: number | null }>();
  if (!model?.deposit_amount) redirect(`/order/cancel?error=1&model=${encodeURIComponent(slug)}`);

  let checkoutUrl: string;
  try {
    const db = createSupabaseAdminClient();
    const { data: order, error } = await db
      .from("orders")
      .insert({ model_slug: model.slug, model_name: model.name, amount: model.deposit_amount })
      .select("id")
      .single<{ id: string }>();
    if (error || !order) throw new Error(error?.message ?? "Захиалга үүссэнгүй");

    const origin = await siteOrigin();
    const checkout = await createCheckout({
      amount: model.deposit_amount,
      productName: `Tesla ${model.name} — урьдчилгаа`,
      productRef: model.slug,
      orderId: order.id,
      successUrl: `${origin}/order/success?id=${order.id}`,
      cancelUrl: `${origin}/order/cancel?model=${model.slug}`,
    });

    await db.from("orders").update({ byl_checkout_id: checkout.id }).eq("id", order.id);
    checkoutUrl = checkout.url;
  } catch (error) {
    console.error("[byl] checkout:", error);
    redirect(`/order/cancel?error=1&model=${encodeURIComponent(model.slug)}`);
  }

  redirect(checkoutUrl);
}
