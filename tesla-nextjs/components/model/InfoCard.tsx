import Image from "next/image";
import type { ImageRef } from "@/data/model-details";

export function InfoCard({ image, title, text }: { image: ImageRef; title: string; text: string }) {
  return (
    // spotlight: хулганы орчимд хүрээ бараан болж, дотор нь дулаан туяа (SpotlightGroup дотор)
    <article className="spotlight group relative h-full overflow-hidden rounded-xl bg-white inset-ring inset-ring-line transition duration-300 ease-out hover:shadow-xl hover:shadow-ink/10 motion-safe:hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-104"
        />
      </div>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted">{text}</p>
      </div>
    </article>
  );
}
