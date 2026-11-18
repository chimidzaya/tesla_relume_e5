import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { NotAdmin } from "@/components/admin/NotAdmin";
import { formatMNT } from "@/lib/format";
import type { OrderRow, OrderStatus } from "@/lib/supabase-admin";
import { getAdminUser } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Admin — Захиалгууд", robots: { index: false } };

const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  complete: { label: "Төлөгдсөн", className: "bg-[#e3efe3] text-[#2f6b35]" },
  open: { label: "Хүлээгдэж буй", className: "bg-beige text-muted" },
  expired: { label: "Хугацаа дууссан", className: "bg-beige text-muted" },
  failed: { label: "Амжилтгүй", className: "bg-[#f6e3de] text-[#b3412b]" },
};

const dateFormat = new Intl.DateTimeFormat("mn-MN", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Asia/Ulaanbaatar",
});

/** Byl-ээр орсон урьдчилгаа захиалгууд. RLS-ээр зөвхөн admin уншина. */
export default async function AdminOrdersPage() {
  const { supabase, user, isAdmin } = await getAdminUser();
  if (!user) redirect("/admin/login");
  if (!isAdmin) return <NotAdmin email={user.email} />;

  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
  const orders = (data ?? []) as OrderRow[];
  const paidTotal = orders.filter((o) => o.status === "complete").reduce((sum, o) => sum + o.amount, 0);

  return (
    <AdminShell
      title="Захиалгууд"
      email={user.email}
      actions={
        <Link href="/admin" className="font-sans text-sm font-medium text-ink underline underline-offset-[3px]">
          ← Загварууд
        </Link>
      }
    >
      <p className="font-sans text-sm text-muted">
        Нийт төлөгдсөн урьдчилгаа: <span className="font-semibold text-ink">{formatMNT(paidTotal)}</span>
      </p>
      {error && <p className="font-sans text-sm text-[#b3412b]">Уншиж чадсангүй: {error.message}</p>}

      <div className="overflow-x-auto rounded-2xl bg-paper shadow-[inset_0_0_0_1px_var(--color-line)]">
        <table className="w-full min-w-[760px] border-collapse text-left font-sans text-sm">
          <thead className="text-muted">
            <tr>
              {["Огноо", "№", "Загвар", "Дүн", "Төлөв", "Холбоо барих"].map((header) => (
                <th key={header} className="border-b border-line px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-ink">
                <td className="border-b border-line px-5 py-4 text-muted">{dateFormat.format(new Date(order.created_at))}</td>
                <td className="border-b border-line px-5 py-4 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                <td className="border-b border-line px-5 py-4 font-semibold">{order.model_name}</td>
                <td className="border-b border-line px-5 py-4 tabular-nums">{formatMNT(order.amount)}</td>
                <td className="border-b border-line px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS[order.status].className}`}>
                    {STATUS[order.status].label}
                  </span>
                </td>
                <td className="border-b border-line px-5 py-4 text-muted">
                  {[order.phone, order.customer_email].filter(Boolean).join(" · ") || "—"}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted">
                  Захиалга алга.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
