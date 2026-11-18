"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { MODELS_CACHE_TAG } from "@/data/models";
import { getImageFile, IMAGE_BUCKET, parseModelForm, type ModelFormState } from "@/lib/model-form";
import { createSupabaseServerClient, getAdminUser } from "@/lib/supabase-server";

export type LoginState = { message?: string; email?: string };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { message: "Имэйл болон нууц үгээ оруулна уу.", email };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { message: "Имэйл эсвэл нууц үг буруу байна.", email };

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** Сайтын бүх хуудсыг шинэ мэдээллээр дахин үүсгэнэ (цэс, хөл хэсэг бүх хуудсанд байдаг). */
function refreshSite() {
  updateTag(MODELS_CACHE_TAG);
  revalidatePath("/", "layout");
}

/** Шинэ загвар нэмэх (originalSlug = null) эсвэл байгааг засах. */
export async function saveModel(
  originalSlug: string | null,
  prev: ModelFormState,
  formData: FormData,
): Promise<ModelFormState> {
  const attempt = prev.attempt + 1;
  const { supabase, isAdmin } = await getAdminUser();
  if (!isAdmin) return { attempt, message: "Танд өөрчлөлт хийх эрх алга." };

  const { values, row, errors } = parseModelForm(formData);
  const image = getImageFile(formData);
  if (image.error) errors.image = image.error;
  if (!row || image.error) return { attempt, values, errors, message: "Маягтын алдааг засна уу." };

  // Шинэ зураг сонгосон бол Supabase Storage руу хуулж, холбоосыг нь хадгална.
  if (image.file) {
    const ext = image.file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${row.slug}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, image.file, { contentType: image.file.type });
    if (uploadError) {
      return { attempt, values, errors: { image: uploadError.message }, message: "Зургийг хуулж чадсангүй." };
    }
    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    row.image = { src: data.publicUrl, alt: values.image?.alt || `Tesla ${row.name}` };
  }

  const { error } = originalSlug
    ? await supabase.from("models").update(row).eq("slug", originalSlug)
    : await supabase.from("models").insert(row);

  if (error) {
    if (error.code === "23505") {
      return { attempt, values, errors: { slug: "Ийм slug-тай загвар аль хэдийн байна." }, message: "Хадгалж чадсангүй." };
    }
    return { attempt, values, message: `Хадгалж чадсангүй: ${error.message}` };
  }

  refreshSite();
  redirect("/admin?saved=" + encodeURIComponent(row.name));
}

export async function deleteModel(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const { supabase, isAdmin } = await getAdminUser();
  if (!isAdmin || !slug) redirect("/admin");

  await supabase.from("models").delete().eq("slug", slug);
  refreshSite();
  redirect("/admin");
}
