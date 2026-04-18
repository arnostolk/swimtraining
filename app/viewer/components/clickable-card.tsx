"use client";

import { type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type ClickableCardProps = {
  href?: string;
  className: string;
  ariaLabel?: string;
  children: ReactNode;
};

function cameFromInteractiveElement(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("a, button, input, textarea, select, summary, [role='button']"));
}

export function ClickableCard({ href, className, ariaLabel, children }: ClickableCardProps) {
  const router = useRouter();

  function navigate() {
    if (href) {
      router.push(href);
    }
  }

  function handleClick(event: MouseEvent<HTMLElement>) {
    if (!href || cameFromInteractiveElement(event.target)) {
      return;
    }

    navigate();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!href) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate();
    }
  }

  return (
    <section
      className={`${className}${href ? " clickable-card" : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={href ? 0 : undefined}
      role={href ? "link" : undefined}
      aria-label={href ? ariaLabel : undefined}
    >
      {children}
    </section>
  );
}
