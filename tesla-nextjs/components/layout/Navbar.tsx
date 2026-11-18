"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { modelHref, models } from "@/data/models";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
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

const links = models.map((model) => ({ label: model.name, href: modelHref(model) }));

export function Navbar() {
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
        "fixed inset-x-0 top-0 z-50 h-[72px] px-5 transition-[background-color,color,box-shadow] duration-300 sm:px-8 lg:px-16",
        solid ? "bg-white/95 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "text-white",
      )}
    >
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
            "absolute inset-x-0 top-[72px] flex-col gap-4 bg-white px-5 pb-6 pt-4 text-ink shadow-[0_12px_24px_rgba(0,0,0,0.08)] sm:px-8",
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
                      "block whitespace-nowrap rounded px-3 py-3 font-medium transition-colors hover:bg-gray-500/15 nav:py-1.5",
                      active && "text-royal nav:rounded-none nav:text-inherit nav:shadow-[inset_0_-2px_0_currentColor]",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-4">
            <Button
              href="/#compare"
              size="sm"
              variant={solid ? "secondary" : "glass"}
              className="flex-1 nav:flex-none"
              onClick={close}
            >
              Харьцуулалт
            </Button>
            <Button href="#contact" size="sm" className="flex-1 nav:flex-none" onClick={close}>
              Холбоо барих
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
