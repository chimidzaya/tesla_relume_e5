"use server";

import { redirect } from "next/navigation";
import { createCheckout } from "@/lib/byl";
import { siteOrigin } from "@/lib/site-origin";
import { supabase } from "@/lib/supabase";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

/**
 * «Захиалах» → захиалга үүсгээд Byl-ийн төлбөрийн хуудас руу шилжүүлнэ.
 * Дүнг хөтчөөс биш, database-ээс уншина (хэрэглэгч өөрчилж чадахгүй).
 */
export async function startCheckout(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const back = `/order/${encodeURIComponent(slug)}`;

  // Constraint: нөхцөлийг зөвшөөрөөгүй бол (JS унтраалттай үед ч) төлбөр рүү явуулахгүй
  if (formData.get("agree") !== "on") redirect(`${back}?error=agree`);

  const { data: model } = await supabase
    .from("models")
    .select("slug, name, deposit_amount")
    .eq("slug", slug)
    .maybeSingle<{ slug: string; name: string; deposit_amount: number | null }>();
  if (!model?.deposit_amount) redirect("/");

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
    redirect(`${back}?error=1`);
  }

  redirect(checkoutUrl);
}
