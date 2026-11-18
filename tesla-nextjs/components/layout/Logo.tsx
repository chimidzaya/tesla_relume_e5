import Link from "next/link";
import { cn } from "@/lib/cn";

/** TESLA wordmark. Сүүлийн үсгийн зайг сөрөг margin-аар нөхөж төвд байрлуулна. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      aria-label="Tesla — нүүр хуудас"
      onClick={onClick}
      className={cn("-mr-[0.42em] whitespace-nowrap text-[22px] font-bold leading-none tracking-[0.42em]", className)}
    >
      TESLA
    </Link>
  );
}
