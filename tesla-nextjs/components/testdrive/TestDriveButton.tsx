"use client";

import type { ReactNode } from "react";
import { buttonClass, type Size, type Variant } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { useTestDrive } from "./TestDriveProvider";

/**
 * «Туршилтын жолоодлого» товч.
 * - `model` өгвөл (загварын хуудас) машин аль хэдийн тодорхой → Cal-ын цаг сонгох цонх шууд, машинтайгаа нээгдэнэ
 * - Өгөхгүй бол (нүүр, цэс) эхлээд машин сонгох цонх гарна
 */
export function TestDriveButton({
  model,
  children = "Туршилтын жолоодлого",
  variant = "glass",
  size = "md",
  className,
  magnetic = true,
  onClick,
}: {
  onClick?: () => void;
  model?: string;
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  magnetic?: boolean;
}) {
  const { open } = useTestDrive();
  const button = (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => {
        onClick?.();
        open(model);
      }}
      className={buttonClass(variant, size, className)}
    >
      <SteeringIcon />
      {children}
    </button>
  );
  return magnetic ? <Magnetic>{button}</Magnetic> : button;
}

/** Жолооны хүрд — «жолоодох» гэсэн metaphor */
function SteeringIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path d="M3 12h7M14 12h7M12 14v7" strokeLinecap="round" />
    </svg>
  );
}
