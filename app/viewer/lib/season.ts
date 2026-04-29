import { addWeeks, format, getISOWeek, parseISO, startOfISOWeek } from "date-fns";

export function getSeasonBounds(seizoen: string) {
  const [startYear, endYear] = seizoen.split("-").map(Number);

  return {
    startYear,
    endYear,
    start: `${startYear}-08-01`,
    end: `${endYear}-07-31`,
  };
}

export function toSeasonSlug(seizoen: string) {
  const [startYear, endYear] = seizoen.split("-");
  return `${startYear.slice(2)}-${endYear.slice(2)}`;
}

export function fromSeasonSlug(seasonSlug: string) {
  const [startYear, endYear] = seasonSlug.split("-");

  if (!/^\d{2}$/.test(startYear) || !/^\d{2}$/.test(endYear)) {
    return undefined;
  }

  return `20${startYear}-20${endYear}`;
}

export function isDateInSeason(date: string, seizoen: string) {
  const bounds = getSeasonBounds(seizoen);
  return date >= bounds.start && date <= bounds.end;
}

export function getSeasonWeekNumber(date: string | Date) {
  const targetDate = typeof date === "string" ? parseISO(date) : date;
  return getISOWeek(targetDate);
}

export function getWeekAnchorForSeasonWeek(seizoen: string, weekNumber: number) {
  const bounds = getSeasonBounds(seizoen);

  for (const year of [bounds.startYear, bounds.endYear]) {
    const firstIsoWeek = startOfISOWeek(new Date(year, 0, 4));
    const candidate = addWeeks(firstIsoWeek, weekNumber - 1);
    const isoDate = format(candidate, "yyyy-MM-dd");

    if (isDateInSeason(isoDate, seizoen) && getISOWeek(candidate) === weekNumber) {
      return isoDate;
    }
  }

  return undefined;
}

export function buildSeasonPath(seizoen: string) {
  return `/${toSeasonSlug(seizoen)}`;
}

export function buildSeasonOverviewPath(seizoen: string) {
  return `${buildSeasonPath(seizoen)}/overzicht`;
}

export function buildSeasonTrainingCalendarPath(seizoen: string) {
  return `${buildSeasonOverviewPath(seizoen)}/trainingskalender`;
}

export function buildSeasonWeekPath(seizoen: string, weekNumber: number) {
  return `${buildSeasonPath(seizoen)}/week/${weekNumber}`;
}

export function buildSeasonTrainingPath(seizoen: string, slug: string) {
  return `${buildSeasonPath(seizoen)}/trainingen/${slug}`;
}

export function buildSeasonWeekPathForDate(date: string, seizoen?: string) {
  const resolvedSeason = seizoen;

  if (!resolvedSeason) {
    return undefined;
  }

  return buildSeasonWeekPath(resolvedSeason, getSeasonWeekNumber(date));
}

export function resolveSeasonFromPathname(pathname: string, seasons: string[]) {
  const seasonSlug = pathname.split("/").filter(Boolean)[0];

  if (!seasonSlug) {
    return undefined;
  }

  const seizoen = fromSeasonSlug(seasonSlug);
  return seizoen && seasons.includes(seizoen) ? seizoen : undefined;
}