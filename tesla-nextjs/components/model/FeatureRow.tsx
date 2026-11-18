import Image from "next/image";
import type { ImageRef } from "@/data/model-details";
import { h4 } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

/** Зураг ба тайлбарын мөр. `reverse` үед зураг баруун талд гарна (зөвхөн өргөн дэлгэцэнд). */
export function FeatureRow({
  image,
  title,
  text,
  reverse = false,
}: {
  image: ImageRef;
  title: string;
  text: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid items-center gap-6 lg:gap-16",
        reverse ? "lg:grid-cols-[2fr_3fr]" : "lg:grid-cols-[3fr_2fr]",
      )}
    >
      <div className={cn("relative aspect-[16/10] overflow-hidden rounded-lg", reverse && "lg:order-2")}>
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className={h4}>{title}</h3>
        <p className="text-lg text-muted">{text}</p>
      </div>
    </div>
  );
}
