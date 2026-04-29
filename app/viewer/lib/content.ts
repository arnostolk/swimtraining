import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { addWeeks, endOfWeek, format, parseISO, startOfWeek } from "date-fns";
import { nl } from "date-fns/locale";

import {
  getSeasonBounds,
  getSeasonWeekNumber,
  getWeekAnchorForSeasonWeek,
  isDateInSeason,
  toSeasonSlug,
} from "@/lib/season";

import type {
  PlannedTraining,
  SeizoensKalender,
  Training,
  TrainingFrontmatter,
  TrainingNavigation,
  TrainingPageData,
  WeekDag,
} from "@/lib/types";

const ROOT = path.resolve(process.cwd(), "..", "..");
const SEIZOENEN_ROOT = path.join(ROOT, "content", "seizoenen");

function normalizeDate(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return format(value, "yyyy-MM-dd");
  }

  throw new Error("Ongeldige datum in frontmatter");
}

function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkMarkdownFiles(fullPath);
    }

    return entry.name.endsWith(".md") ? [fullPath] : [];
  });
}

function getSeasonRoot(seizoen: string) {
  return path.join(SEIZOENEN_ROOT, seizoen);
}

function getTrainingsRoot(seizoen: string) {
  return path.join(getSeasonRoot(seizoen), "trainingen");
}

export function getAvailableSeasons() {
  return fs
    .readdirSync(SEIZOENEN_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function formatSeasonShortLabel(seizoen: string) {
  return toSeasonSlug(seizoen);
}

export function resolveSeasonForDate(date: string | Date) {
  const isoDate = typeof date === "string" ? date : format(date, "yyyy-MM-dd");
  const seasons = getAvailableSeasons();

  const matchedSeason = seasons.find((seizoen) => {
    const bounds = getSeasonBounds(seizoen);
    return isoDate >= bounds.start && isoDate <= bounds.end;
  });

  return matchedSeason ?? seasons[seasons.length - 1];
}

function parseDutchDate(input: string): string {
  const months: Record<string, string> = {
    jan: "01",
    feb: "02",
    mrt: "03",
    apr: "04",
    mei: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    okt: "10",
    nov: "11",
    dec: "12",
  };

  const cleaned = input.replace(/`/g, "").trim();
  const parts = cleaned.split(/\s+/);
  const [dag, maand, jaar] = parts.length === 4 ? parts.slice(1) : parts;

  return `${jaar}-${months[maand]}-${dag.padStart(2, "0")}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildPlannedTrainingSlug(datum: string, primair_thema: string, slagfocus: string) {
  return `${datum}-${slugify(primair_thema)}-${slugify(slagfocus)}`;
}

export function getAllTrainings(seizoen?: string): Training[] {
  const seasons = seizoen ? [seizoen] : getAvailableSeasons();

  return seasons
    .flatMap((currentSeason) => {
      const files = walkMarkdownFiles(getTrainingsRoot(currentSeason));

      return files.map((filePath) => {
        const file = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(file);
        const frontmatter = data as TrainingFrontmatter & { datum: unknown };

        return {
          ...frontmatter,
          datum: normalizeDate(frontmatter.datum),
          content,
          path: filePath,
        } satisfies Training;
      });
    })
    .filter((training) => training.public !== false)
    .sort((a, b) => a.datum.localeCompare(b.datum));
}

export function getTrainingBySlug(slug: string, seizoen?: string): Training | undefined {
  return getAllTrainings(seizoen).find((training) => training.slug === slug);
}

export function getSeasonCalendar(seizoen: string): SeizoensKalender {
  const filePath = path.join(getSeasonRoot(seizoen), "metadata", "kalender.json");
  const file = fs.readFileSync(filePath, "utf8");
  return JSON.parse(file) as SeizoensKalender;
}

export function getOverviewDocument(seizoen: string, slug: "kalender" | "trainingskalender") {
  const filePath = path.join(getSeasonRoot(seizoen), "overzicht", `${slug}.md`);
  return fs.readFileSync(filePath, "utf8");
}

export function getPlannedTrainings(seizoen?: string): PlannedTraining[] {
  const seasons = seizoen ? [seizoen] : getAvailableSeasons();
  const trainings = getAllTrainings(seizoen);
  const slugByDate = new Map(trainings.map((training) => [training.datum, training.slug]));

  return seasons
    .flatMap((currentSeason) => {
      const file = getOverviewDocument(currentSeason, "trainingskalender");
      const lines = file.split(/\r?\n/);

      return lines
        .filter((line) => line.startsWith("| ") && !line.includes("---") && !line.includes("Datum |"))
        .map((line) => line.split("|").map((part) => part.trim()).filter(Boolean))
        .map(([datum, periode, primair_thema, secundair_thema, sessievorm, slagfocus, reden]) => {
          const isoDate = parseDutchDate(datum);

          return {
            datum: isoDate,
            periode,
            primair_thema,
            secundair_thema,
            sessievorm,
            slagfocus,
            reden,
            slug: slugByDate.get(isoDate) ?? buildPlannedTrainingSlug(isoDate, primair_thema, slagfocus),
          } satisfies PlannedTraining;
        });
    })
    .sort((a, b) => a.datum.localeCompare(b.datum));
}

export function getSeasonDefaultWeekAnchor(seizoen: string) {
  const today = format(new Date(), "yyyy-MM-dd");
  const todaySeason = resolveSeasonForDate(today);

  if (todaySeason === seizoen) {
    return getWeekAnchorDate(today);
  }

  const firstTraining = getPlannedTrainings(seizoen)[0];

  if (firstTraining) {
    return getWeekAnchorDate(firstTraining.datum);
  }

  const bounds = getSeasonBounds(seizoen);
  return getWeekAnchorDate(bounds.start);
}

export function resolveSeasonFromSlug(seasonSlug: string) {
  const seasons = getAvailableSeasons();
  return seasons.find((seizoen) => toSeasonSlug(seizoen) === seasonSlug);
}

export function getWeekAnchorForSeasonNumber(seizoen: string, weekNumber: number) {
  return getWeekAnchorForSeasonWeek(seizoen, weekNumber);
}

export function getSeasonWeekNumberForDate(date: string | Date) {
  return getSeasonWeekNumber(date);
}

export function getUpcomingTraining(today = new Date(), seizoen?: string): PlannedTraining | undefined {
  const isoToday = format(today, "yyyy-MM-dd");
  return getPlannedTrainings(seizoen).find((training) => training.datum >= isoToday);
}

export function getTrainingForDate(date: string): PlannedTraining | undefined {
  const seizoen = resolveSeasonForDate(date);
  return getPlannedTrainings(seizoen).find((training) => training.datum === date);
}

export function getTrainingForDateInSeason(date: string, seizoen: string): PlannedTraining | undefined {
  if (!isDateInSeason(date, seizoen)) {
    return undefined;
  }

  return getPlannedTrainings(seizoen).find((training) => training.datum === date);
}

export function getWeekDaysForDate(date: string | Date): WeekDag[] {
  const targetDate = typeof date === "string" ? parseISO(date) : date;
  return buildWeekDays(targetDate);
}

export function getWeekAnchorDate(date: string | Date) {
  const targetDate = typeof date === "string" ? parseISO(date) : date;
  return format(startOfWeek(targetDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
}

export function shiftWeekAnchorDate(date: string | Date, offset: number) {
  const targetDate = typeof date === "string" ? parseISO(date) : date;
  return format(addWeeks(startOfWeek(targetDate, { weekStartsOn: 1 }), offset), "yyyy-MM-dd");
}

function getBlockedDayName(date: string) {
  const seizoen = resolveSeasonForDate(date);
  const calendar = getSeasonCalendar(seizoen) as SeizoensKalender & {
    geen_training_dagen?: Array<{ datum: string; naam: string }>;
  };

  return calendar.geen_training_dagen?.find((dag) => dag.datum === date)?.naam;
}

export function getVacationForDate(date: string) {
  const seizoen = resolveSeasonForDate(date);
  const calendar = getSeasonCalendar(seizoen);
  return calendar.vakanties.find((vakantie) => date >= vakantie.start && date <= vakantie.einde);
}

export function getCompetitionForDate(date: string) {
  const seizoen = resolveSeasonForDate(date);
  const calendar = getSeasonCalendar(seizoen);
  return calendar.wedstrijden.find((wedstrijd) => wedstrijd.datum === date);
}

function getCompetitionForDateInSeason(date: string, seizoen: string) {
  if (!isDateInSeason(date, seizoen)) {
    return undefined;
  }

  const calendar = getSeasonCalendar(seizoen);
  return calendar.wedstrijden.find((wedstrijd) => wedstrijd.datum === date);
}

export function buildWeekDays(today = new Date()): WeekDag[] {
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const upcoming = getUpcomingTraining(today);
  const days: WeekDag[] = [];

  for (let cursor = weekStart; cursor <= weekEnd; cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)) {
    const isoDate = format(cursor, "yyyy-MM-dd");
    const vacation = getVacationForDate(isoDate);
    const competition = getCompetitionForDate(isoDate);
    const training = getTrainingForDate(isoDate);
    const blockedDay = getBlockedDayName(isoDate);

    let status: WeekDag["status"] = "geen-training";
    let reden: string | undefined;

    if (vacation) {
      status = "vakantie";
      reden = vacation.naam;
    } else if (blockedDay) {
      status = "geen-training";
      reden = blockedDay;
    } else if (training) {
      status = "training";
    } else if (competition) {
      status = "wedstrijd";
      reden = competition.naam;
    }

    if (training && isoDate === format(today, "yyyy-MM-dd")) {
      status = "vandaag-training";
    } else if (training && upcoming && isoDate === upcoming.datum && isoDate !== format(today, "yyyy-MM-dd")) {
      status = "volgende-training";
    }

    days.push({
      datum: isoDate,
      dagnaamKort: format(cursor, "EEE", { locale: nl }),
      dagLabel: formatDutchShortNumericDate(isoDate),
      status,
      reden,
      training,
      wedstrijd: competition,
    });
  }

  return days;
}

export function getTodayCard(today = new Date(), seizoen?: string) {
  const isoToday = format(today, "yyyy-MM-dd");
  const training = seizoen ? getTrainingForDateInSeason(isoToday, seizoen) : getTrainingForDate(isoToday);
  const vacation = seizoen && !isDateInSeason(isoToday, seizoen) ? undefined : getVacationForDate(isoToday);
  const competition = seizoen ? getCompetitionForDateInSeason(isoToday, seizoen) : getCompetitionForDate(isoToday);
  const blockedDay = seizoen && !isDateInSeason(isoToday, seizoen) ? undefined : getBlockedDayName(isoToday);
  const upcoming = getUpcomingTraining(today, seizoen);

  if (training) {
    return {
      type: "training" as const,
      title: "Vandaag",
      training,
    };
  }

  return {
    type: "geen-training" as const,
    title: "Vandaag",
    reason: vacation?.naam ?? blockedDay ?? competition?.naam ?? "Geen training vandaag",
    nextTraining: upcoming,
  };
}

export function formatDutchDate(date: string) {
  return formatDutchLongNumericDate(date);
}

export function formatDutchLongNumericDate(date: string) {
  const formatted = format(parseISO(date), "EEEE dd-MM-yyyy", { locale: nl });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatDutchShortNumericDate(date: string) {
  const formatted = format(parseISO(date), "EE dd-MM-yyyy", { locale: nl });
  const [day, ...rest] = formatted.split(" ");
  return `${day.toLowerCase()} ${rest.join(" ")}`;
}

export function getTrainingPageData(slug: string, seizoen?: string): TrainingPageData | undefined {
  const uitgewerkteTraining = getTrainingBySlug(slug, seizoen);

  if (uitgewerkteTraining) {
    return {
      slug: uitgewerkteTraining.slug,
      datum: uitgewerkteTraining.datum,
      periode: uitgewerkteTraining.periode,
      primair_thema: uitgewerkteTraining.primair_thema,
      secundair_thema: uitgewerkteTraining.secundair_thema,
      sessievorm: uitgewerkteTraining.sessievorm,
      slagfocus: uitgewerkteTraining.slagfocus,
      totale_afstand_m: uitgewerkteTraining.totale_afstand_m,
      duur_min: uitgewerkteTraining.duur_min,
      content: uitgewerkteTraining.content,
      isUitgewerkt: true,
    };
  }

  const geplandeTraining = getPlannedTrainings(seizoen).find((training) => training.slug === slug);

  if (!geplandeTraining) {
    return undefined;
  }

  return {
    slug: geplandeTraining.slug,
    datum: geplandeTraining.datum,
    periode: geplandeTraining.periode,
    primair_thema: geplandeTraining.primair_thema,
    secundair_thema: geplandeTraining.secundair_thema,
    sessievorm: geplandeTraining.sessievorm,
    slagfocus: geplandeTraining.slagfocus,
    reden: geplandeTraining.reden,
    duur_min: 60,
    isUitgewerkt: false,
  };
}

export function getTrainingNavigation(slug: string, seizoen?: string): TrainingNavigation {
  const trainingen = getPlannedTrainings(seizoen);
  const index = trainingen.findIndex((training) => training.slug === slug);

  if (index === -1) {
    return {};
  }

  const previous = index > 0 ? trainingen[index - 1] : undefined;
  const next = index < trainingen.length - 1 ? trainingen[index + 1] : undefined;

  return {
    previous: previous
      ? {
          slug: previous.slug,
          datum: previous.datum,
          primair_thema: previous.primair_thema,
        }
      : undefined,
    next: next
      ? {
          slug: next.slug,
          datum: next.datum,
          primair_thema: next.primair_thema,
        }
      : undefined,
  };
}
