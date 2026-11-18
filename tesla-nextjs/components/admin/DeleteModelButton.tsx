"use client";

import { deleteModel } from "@/app/admin/actions";

/** Устгахаас өмнө баталгаажуулалт асууна. */
export function DeleteModelButton({ slug, name }: { slug: string; name: string }) {
  return (
    <form
      action={deleteModel}
      onSubmit={(event) => {
        if (!window.confirm(`«${name}» загварыг устгах уу? Энэ үйлдлийг буцаах боломжгүй.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button type="submit" className="text-[#b3412b] underline-offset-[3px] hover:underline">
        Устгах
      </button>
    </form>
  );
}
