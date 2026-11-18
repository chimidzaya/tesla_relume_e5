import Image from "next/image";
import type { ImageRef } from "@/data/model-details";

export function InfoCard({ image, title, text }: { image: ImageRef; title: string; text: string }) {
  return (
    <article className="h-full overflow-hidden rounded-xl border border-line bg-white">
      <div className="relative aspect-[4/3]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted">{text}</p>
      </div>
    </article>
  );
}
