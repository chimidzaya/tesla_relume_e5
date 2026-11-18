import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminUser } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Admin — Нэвтрэх", robots: { index: false } };

export default async function AdminLoginPage() {
  const { user } = await getAdminUser();
  if (user) redirect("/admin");

  return (
    <AdminShell title="Нэвтрэх">
      <LoginForm />
    </AdminShell>
  );
}
