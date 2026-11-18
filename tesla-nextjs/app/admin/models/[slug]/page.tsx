import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { saveModel } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { ModelForm } from "@/components/admin/ModelForm";
import { NotAdmin } from "@/components/admin/NotAdmin";
import { toModel, type Model, type ModelRow } from "@/data/models";
import { getAdminUser } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Admin — Загвар засах", robots: { index: false } };

/** Шинэ загварын маягтын анхны утгууд */
const blankModel: Model = {
  slug: "",
  sortOrder: 99,
  name: "",
  category: "",
  lead: "",
  features: [],
  specs: [],
  type: "",
  seats: 5,
  range: "",
  price: "",
  visual: { tag: "", theme: "blue" },
  orderUrl: "https://www.tesla.com",
  orderLabel: "Захиалах",
  learnUrl: "https://www.tesla.com",
  hasDetailPage: false,
};

/** /admin/models/new — шинэ загвар, /admin/models/<slug> — байгаа загварыг засах */
export default async function AdminModelPage({ params }: PageProps<"/admin/models/[slug]">) {
  const { slug } = await params;
  const { supabase, user, isAdmin } = await getAdminUser();
  if (!user) redirect("/admin/login");
  if (!isAdmin) return <NotAdmin email={user.email} />;

  const isNew = slug === "new";
  let model = blankModel;

  if (!isNew) {
    const { data } = await supabase.from("models").select("*").eq("slug", slug).maybeSingle();
    if (!data) notFound();
    model = toModel(data as ModelRow);
  }

  const action = saveModel.bind(null, isNew ? null : slug);

  return (
    <AdminShell
      title={isNew ? "Шинэ загвар нэмэх" : `${model.name} — засах`}
      email={user.email}
      image={isNew ? undefined : (model.image ?? null)}
    >
      <ModelForm initial={model} action={action} />
    </AdminShell>
  );
}
