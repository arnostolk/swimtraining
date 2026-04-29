"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { resolveSeasonFromPathname } from "@/lib/season";

type MenuToggleProps = {
  activeSeason: string;
  seasons: Array<{
    seizoen: string;
    label: string;
    homeHref: string;
    weekHref: string;
    overviewHref: string;
    trainingCalendarHref: string;
  }>;
};

export function MenuToggle({ activeSeason, seasons }: MenuToggleProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const currentSeason = resolveSeasonFromPathname(pathname, seasons.map((season) => season.seizoen)) ?? activeSeason;
  const currentLinks = seasons.find((season) => season.seizoen === currentSeason) ?? seasons[0];

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
          <Link href={currentLinks.homeHref} onClick={() => setOpen(false)}>
            Seizoenhome
          </Link>
          <Link href={currentLinks.weekHref} onClick={() => setOpen(false)}>
            Deze week
          </Link>
          <Link href={currentLinks.overviewHref} onClick={() => setOpen(false)}>
            Overzicht
          </Link>
          <Link href={currentLinks.trainingCalendarHref} onClick={() => setOpen(false)}>
            Trainingskalender
          </Link>
          <Link href="/archief" onClick={() => setOpen(false)}>
            Archief
          </Link>
          <div className="topnav-divider" />
          {seasons.map((season) => (
            <Link key={season.seizoen} href={season.homeHref} onClick={() => setOpen(false)}>
              Seizoen {season.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
