"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type SeasonTitleProps = {
  fallbackSeasonLabel: string;
  availableSeasons: string[];
};

function formatSeasonShortLabel(seizoen: string) {
  const [startYear, endYear] = seizoen.split("-");
  return `${startYear.slice(2)}-${endYear.slice(2)}`;
}

function resolveSeasonFromDate(date: string, availableSeasons: string[]) {
  const matchedSeason = availableSeasons.find((seizoen) => {
    const [startYear, endYear] = seizoen.split("-").map(Number);
    return date >= `${startYear}-08-01` && date <= `${endYear}-07-31`;
  });

  return matchedSeason ?? availableSeasons[availableSeasons.length - 1];
}

export function SeasonTitle({ fallbackSeasonLabel, availableSeasons }: SeasonTitleProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const seasonLabel = useMemo(() => {
    const explicitSeason = searchParams.get("seizoen");

    if (explicitSeason && availableSeasons.includes(explicitSeason)) {
      return formatSeasonShortLabel(explicitSeason);
    }

    const weekDate = searchParams.get("week") ?? searchParams.get("datum");

    if (weekDate) {
      return formatSeasonShortLabel(resolveSeasonFromDate(weekDate, availableSeasons));
    }

    const slugMatch = pathname.match(/\/trainingen\/(\d{4}-\d{2}-\d{2})-/);

    if (slugMatch?.[1]) {
      return formatSeasonShortLabel(resolveSeasonFromDate(slugMatch[1], availableSeasons));
    }

    return fallbackSeasonLabel;
  }, [availableSeasons, fallbackSeasonLabel, pathname, searchParams]);

  return <span className="brand-text">Trainingen {seasonLabel}</span>;
}
