import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteModelButton } from "@/components/admin/DeleteModelButton";
import { NotAdmin } from "@/components/admin/NotAdmin";
import { submitClass } from "@/components/admin/fields";
import { modelHref, toModel, type ModelRow } from "@/data/models";
import { getAdminUser } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Admin — Загварууд", robots: { index: false } };

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const { supabase, user, isAdmin } = await getAdminUser();
  if (!user) redirect("/admin/login");
  if (!isAdmin) return <NotAdmin email={user.email} />;

  const { saved } = await searchParams;
  const { data, error } = await supabase.from("models").select("*").order("sort_order");
  const models = ((data ?? []) as ModelRow[]).map(toModel);

  return (
    <AdminShell
      title="Загварууд"
      email={user.email}
      actions={
        <>
          <Link href="/admin/models/new" className={submitClass}>
            + Шинэ загвар нэмэх
          </Link>
          <Link href="/admin/orders" className="font-sans text-sm font-medium text-ink underline underline-offset-[3px]">
            Захиалгууд (Byl) →
          </Link>
          <Link href="/admin/test-drives" className="font-sans text-sm font-medium text-ink underline underline-offset-[3px]">
            Туршилтын жолоодлого →
          </Link>
        </>
      }
    >
      {typeof saved === "string" && (
        <p role="status" className="rounded-lg bg-paper px-4 py-3 font-sans text-sm text-ink shadow-[inset_0_0_0_1px_var(--color-line)]">
          ✓ «{saved}» хадгалагдлаа. Сайт дээр шууд шинэчлэгдсэн.
        </p>
      )}
      {error && <p className="font-sans text-sm text-[#b3412b]">Уншиж чадсангүй: {error.message}</p>}

      <div className="overflow-x-auto rounded-2xl bg-paper shadow-[inset_0_0_0_1px_var(--color-line)]">
        <table className="w-full min-w-[720px] border-collapse text-left font-sans text-sm">
          <thead className="text-muted">
            <tr>
              {["#", "Загвар", "Ангилал", "Үнэ", "Замын нөөц", ""].map((header) => (
                <th key={header} className="border-b border-line px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.slug} className="text-ink">
                <td className="border-b border-line px-5 py-4 text-muted">{model.sortOrder}</td>
                <td className="border-b border-line px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex aspect-[16/10] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-beige shadow-[inset_0_0_0_1px_var(--color-line)]">
                      {model.image ? (
                        <Image src={model.image.src} alt={model.image.alt} fill sizes="88px" className="object-cover" />
                      ) : (
                        <span className="text-2xs text-muted">Зураг алга</span>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">{model.name}</span>
                      {model.badge && <span className="ml-2 text-muted">· {model.badge}</span>}
                    </div>
                  </div>
                </td>
                <td className="border-b border-line px-5 py-4">{model.category}</td>
                <td className="border-b border-line px-5 py-4">{model.price}</td>
                <td className="border-b border-line px-5 py-4">{model.range}</td>
                <td className="border-b border-line px-5 py-4">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={modelHref(model)} className="text-muted underline-offset-[3px] hover:underline">
                      Харах
                    </Link>
                    <Link
                      href={`/admin/models/${model.slug}`}
                      className="font-medium underline underline-offset-[3px]"
                    >
                      Засах
                    </Link>
                    <DeleteModelButton slug={model.slug} name={model.name} />
                  </div>
                </td>
              </tr>
            ))}
            {models.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted">
                  Загвар алга. «Шинэ загвар нэмэх» товчоор нэмнэ үү.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
