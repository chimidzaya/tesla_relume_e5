import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Нэвтэрсэн хэрэглэгчийн session-тэй Supabase client (admin хэсэгт).
 * Хүсэлт бүрт шинээр үүсгэнэ. Server Component, Server Action дотор ашиглана.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Component дотор cookie бичиж болохгүй — proxy.ts session-ийг шинэчилдэг тул зүгээр.
          }
        },
      },
    },
  );
}

/** Нэвтэрсэн хэрэглэгч admin мөн эсэхийг шалгана. */
export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false };

  const { data } = await supabase.rpc("is_admin");
  return { supabase, user, isAdmin: data === true };
}
