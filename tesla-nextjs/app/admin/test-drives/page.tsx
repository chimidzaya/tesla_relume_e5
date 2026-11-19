import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { NotAdmin } from "@/components/admin/NotAdmin";
import { getModels } from "@/data/models";
import { TEST_DRIVE_FEE } from "@/lib/cal";
import { cn } from "@/lib/cn";
import { formatMNT } from "@/lib/format";
import type { TestDriveRow, TestDriveStatus } from "@/lib/supabase-admin";
import { getAdminUser } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Admin — Туршилтын жолоодлого", robots: { index: false } };

const STATUS: Record<TestDriveStatus, { label: string; className: string }> = {
  confirmed: { label: "Баталгаажсан", className: "bg-[#e3efe3] text-[#2f6b35]" },
  pending_payment: { label: "Төлбөр хүлээж буй", className: "bg-beige text-ink" },
  rescheduled: { label: "Цаг өөрчилсөн", className: "bg-beige text-muted" },
  cancelled: { label: "Цуцалсан", className: "bg-[#f6e3de] text-[#b3412b]" },
  expired: { label: "Төлөөгүй — цуцлагдсан", className: "bg-beige text-muted" },
  refund_needed: { label: "Буцаалт хэрэгтэй", className: "bg-[#b3412b] text-white" },
};

const dateFormat = new Intl.DateTimeFormat("mn-MN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ulaanbaatar",
});

/** Cal.com-оор орсон туршилтын жолоодлогууд, машинаар шүүнэ. RLS-ээр зөвхөн admin уншина. */
export default async function AdminTestDrivesPage({ searchParams }: PageProps<"/admin/test-drives">) {
  const { supabase, user, isAdmin } = await getAdminUser();
  if (!user) redirect("/admin/login");
  if (!isAdmin) return <NotAdmin email={user.email} />;

  const { model } = await searchParams;
  const filter = typeof model === "string" ? model : null;

  let query = supabase.from("test_drives").select("*").order("start_time", { ascending: false }).limit(300);
  if (filter) query = query.eq("model_slug", filter);
  const [{ data, error }, models] = await Promise.all([query, getModels()]);
  const drives = (data ?? []) as TestDriveRow[];
  const now = new Date();
  const upcoming = drives.filter((d) => d.status === "confirmed" && new Date(d.start_time) > now).length;
  const refunds = drives.filter((d) => d.status === "refund_needed").length;
  const paidTotal = drives.filter((d) => d.paid_at).length * TEST_DRIVE_FEE;

  const chip = (active: boolean) =>
    cn(
      "rounded-full px-3.5 py-1.5 font-sans text-sm transition-colors",
      active ? "bg-ink text-on-dark" : "text-ink inset-ring inset-ring-line hover:bg-ink/[0.06]",
    );

  return (
    <AdminShell
      title="Туршилтын жолоодлого"
      email={user.email}
      actions={
        <Link href="/admin" className="font-sans text-sm font-medium text-ink underline underline-offset-[3px]">
          ← Загварууд
        </Link>
      }
    >
      <p className="flex flex-wrap gap-x-6 gap-y-1 font-sans text-sm text-muted">
        <span>
          Удахгүй болох: <span className="font-semibold text-ink">{upcoming}</span>
        </span>
        <span>
          Нийт төлбөр: <span className="font-semibold text-ink">{formatMNT(paidTotal)}</span>
        </span>
        {refunds > 0 && (
          <span className="font-semibold text-[#b3412b]">Буцаалт хүлээж буй: {refunds}</span>
        )}
      </p>

      <nav aria-label="Машинаар шүүх" className="flex flex-wrap gap-2">
        <Link href="/admin/test-drives" className={chip(!filter)} aria-current={!filter ? "page" : undefined}>
          Бүгд
        </Link>
        {models.map((m) => (
          <Link
            key={m.slug}
            href={`/admin/test-drives?model=${m.slug}`}
            className={chip(filter === m.slug)}
            aria-current={filter === m.slug ? "page" : undefined}
          >
            {m.name}
          </Link>
        ))}
      </nav>

      {error && <p className="font-sans text-sm text-[#b3412b]">Уншиж чадсангүй: {error.message}</p>}

      <div className="overflow-x-auto rounded-2xl bg-paper shadow-[inset_0_0_0_1px_var(--color-line)]">
        <table className="w-full min-w-[760px] border-collapse text-left font-sans text-sm">
          <thead className="text-muted">
            <tr>
              {["Цаг", "Машин", "Захиалагч", "Холбоо барих", "Төлбөр", "Төлөв"].map((header) => (
                <th key={header} className="border-b border-line px-5 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drives.map((drive) => (
              <tr
                key={drive.booking_uid}
                className={cn("text-ink", ["expired", "cancelled", "rescheduled"].includes(drive.status) && "text-muted")}
              >
                <td className="border-b border-line px-5 py-4 tabular-nums">{dateFormat.format(new Date(drive.start_time))}</td>
                <td className="border-b border-line px-5 py-4 font-semibold">{drive.model_name ?? drive.model_slug ?? "—"}</td>
                <td className="border-b border-line px-5 py-4">{drive.name ?? "—"}</td>
                <td className="border-b border-line px-5 py-4 text-muted">
                  {[drive.phone, drive.email].filter(Boolean).join(" · ") || "—"}
                </td>
                <td className="border-b border-line px-5 py-4 tabular-nums">
                  {drive.paid_at ? formatMNT(TEST_DRIVE_FEE) : <span className="text-muted">—</span>}
                </td>
                <td className="border-b border-line px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS[drive.status].className}`}>
                    {STATUS[drive.status].label}
                  </span>
                </td>
              </tr>
            ))}
            {drives.length === 0 && (
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
