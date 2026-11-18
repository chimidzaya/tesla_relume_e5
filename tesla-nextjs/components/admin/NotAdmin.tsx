import { AdminShell } from "./AdminShell";

/** Нэвтэрсэн боловч admins хүснэгтэд бүртгэлгүй хэрэглэгчид харагдана. */
export function NotAdmin({ email }: { email?: string }) {
  return (
    <AdminShell title="Эрх хүрэлцэхгүй" email={email}>
      <p className="max-w-[564px] font-serif text-base leading-body text-muted">
        Та нэвтэрсэн боловч admin эрхгүй байна. Supabase-ийн <code>admins</code> хүснэгтэд өөрийн хэрэглэгчийг
        нэмүүлнэ үү.
      </p>
    </AdminShell>
  );
}
