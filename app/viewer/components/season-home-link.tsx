"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { buildSeasonPath, resolveSeasonFromPathname } from "@/lib/season";

type SeasonHomeLinkProps = {
  activeSeason: string;
  availableSeasons: string[];
  children: ReactNode;
};

export function SeasonHomeLink({ activeSeason, availableSeasons, children }: SeasonHomeLinkProps) {
  const pathname = usePathname();
  const currentSeason = resolveSeasonFromPathname(pathname, availableSeasons) ?? activeSeason;

  return (
    <Link href={buildSeasonPath(currentSeason)} className="brand">
      {children}
    </Link>
  );
}