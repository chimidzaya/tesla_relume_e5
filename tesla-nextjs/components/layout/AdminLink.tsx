"use client";

import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Зөвхөн admin нэвтэрсэн үед харагдах «Admin» холбоос.
 * Хуудсууд статик (ISR) тул нэвтэрсэн эсэхийг хөтөч дээр шалгана.
 */
export function AdminLink({ className }: { className?: string }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data } = await supabase.rpc("is_admin");
      if (active) setIsAdmin(data === true);
    });

    return () => {
      active = false;
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <li>
      <Link href="/admin" className={className}>
        Admin
      </Link>
    </li>
  );
}
