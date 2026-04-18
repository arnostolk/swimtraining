"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type MenuToggleProps = {
  seasons: Array<{
    seizoen: string;
    label: string;
    href: string;
  }>;
};

export function MenuToggle({ seasons }: MenuToggleProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="menu-toggle" ref={rootRef}>
      <button
        type="button"
        className="menu-button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {open ? (
        <nav className="topnav">
          <Link href="/" onClick={() => setOpen(false)}>
            Vandaag
          </Link>
          <Link href="/week" onClick={() => setOpen(false)}>
            Deze week
          </Link>
          <Link href="/archief" onClick={() => setOpen(false)}>
            Archief
          </Link>
          <div className="topnav-divider" />
          {seasons.map((season) => (
            <Link key={season.seizoen} href={season.href} onClick={() => setOpen(false)}>
              Seizoen {season.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
