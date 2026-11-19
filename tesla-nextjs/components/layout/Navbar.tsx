"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { TestDriveButton } from "@/components/testdrive/TestDriveButton";
import { Logo } from "./Logo";

const SCROLL_THRESHOLD = 40;

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

/** Хуудас доош гүйлгэгдсэн эсэх. Сервер дээр үргэлж false. */
function useScrolled() {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > SCROLL_THRESHOLD,
    () => false,
  );
}

export type NavLink = { label: string; href: string };

/** `links` — загваруудын холбоос; layout нь Supabase-ээс уншаад дамжуулна. */
export function Navbar({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const solid = scrolled || open;
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <nav
      aria-label="Үндсэн цэс"
      className={cn(
        // Transparent → Solid Header: 40px-ээс доош гүйлгэхэд cream дэвсгэр + hairline · transition duration-400.
        // Тунгалаг үед header scrim (ink 35% → transparent) бичвэрийг уншигдахуйц болгоно.
        "fixed inset-x-0 top-0 z-50 h-[72px] px-gutter transition duration-400 ease-in-out",
        solid
          ? "bg-paper/85 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl"
          : "bg-[linear-gradient(180deg,rgb(25_20_14/0.35),transparent)] text-on-dark",
      )}
    >
      {/* Scroll progress: цэсний hairline-ийн дээгүүр 1px ink шугам дүүрнэ.
          Hero дээр (тунгалаг цэс) нуугдана; хөтөч scroll-driven animation дэмжихгүй бол огт гарахгүй. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 -bottom-px hidden h-px bg-ink/70 scroll-progress transition-opacity duration-500 supports-[animation-timeline:scroll()]:block",
          solid && !open ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="mx-auto flex h-full max-w-site items-center justify-between">
        <Logo onClick={close} />

        <button
          type="button"
          className="relative size-10 nav:hidden"
          aria-label={open ? "Цэс хаах" : "Цэс нээх"}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span
            className={cn(
              "absolute left-[9px] top-[13px] h-0.5 w-[22px] bg-current transition-transform duration-200",
              open && "translate-y-1.5 rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute left-[9px] top-[19px] h-0.5 w-[22px] bg-current transition-opacity duration-200",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "absolute left-[9px] top-[25px] h-0.5 w-[22px] bg-current transition-transform duration-200",
              open && "-translate-y-1.5 -rotate-45",
            )}
          />
        </button>

        <div
          id="nav-menu"
          className={cn(
            "absolute inset-x-0 top-[72px] flex-col gap-4 bg-paper px-gutter pb-6 pt-4 text-ink shadow-[0_1px_0_var(--color-line)]",
            open ? "flex" : "hidden",
            "nav:static nav:flex nav:flex-row nav:items-center nav:gap-8 nav:bg-transparent nav:p-0 nav:text-inherit nav:shadow-none",
          )}
        >
          <ul className="flex flex-col nav:flex-row nav:items-center nav:gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block whitespace-nowrap rounded-lg px-3 py-3 font-medium transition-colors duration-200 hover:bg-current/[0.08] active:opacity-60 nav:py-1.5",
                      active && "text-ink nav:rounded-none nav:text-inherit nav:shadow-[inset_0_-2px_0_currentColor]",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-4 nav:flex-nowrap">
            <TestDriveButton
              size="sm"
              variant={solid ? "secondary" : "glass"}
              magnetic={false}
              // 1152–1279px-д цэс багтахгүй тул нуугдана (hero дээрх товч хэвээр); утасны цэсэнд бүтэн өргөнөөр
              className="w-full nav:hidden xl:inline-flex xl:w-auto"
              onClick={close}
            >
              Туршиж үзэх
            </TestDriveButton>
            <Button
              href="/#compare"
              size="sm"
              variant={solid ? "secondary" : "glass"}
              className="flex-1 nav:flex-none"
              onClick={close}
            >
              Харьцуулалт
            </Button>
            <Button
              href="#contact"
              size="sm"
              variant={solid ? "dark" : "outline-light"}
              className="flex-1 nav:flex-none"
              onClick={close}
            >
              Холбоо барих
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
