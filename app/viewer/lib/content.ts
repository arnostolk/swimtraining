import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { addWeeks, format, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { nl } from "date-fns/locale";

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
const CONTENT_ROOT = path.join(ROOT, "content", "seizoenen", "2026-2027");
const TRAININGEN_ROOT = path.join(CONTENT_ROOT, "trainingen");

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
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkMarkdownFiles(fullPath);
    }

    return entry.name.endsWith(".md") ? [fullPath] : [];
  });
}

export function getAllTrainings(): Training[] {
  const files = walkMarkdownFiles(TRAININGEN_ROOT);

  return files
    .map((filePath) => {
      const file = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(file);

      const frontmatter = data as TrainingFrontmatter & { datum: unknown };

      return {
        ...frontmatter,
        datum: normalizeDate(frontmatter.datum),
        content,
        path: filePath,
      } satisfies Training;
    })
    .filter((training) => training.public !== false)
    .sort((a, b) => a.datum.localeCompare(b.datum));
}

export function getTrainingBySlug(slug: string): Training | undefined {
  return getAllTrainings().find((training) => training.slug === slug);
}

export function getSeasonCalendar(): SeizoensKalender {
  const filePath = path.join(CONTENT_ROOT, "metadata", "kalender.json");
  const file = fs.readFileSync(filePath, "utf8");
  return JSON.parse(file) as SeizoensKalender;
}

export function getOverviewDocument(slug: "kalender" | "trainingskalender") {
  const filePath = path.join(CONTENT_ROOT, "overzicht", `${slug}.md`);
  return fs.readFileSync(filePath, "utf8");
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

export function getPlannedTrainings(): PlannedTraining[] {
  const file = getOverviewDocument("trainingskalender");
  const lines = file.split(/\r?\n/);
  const trainings = getAllTrainings();
  const slugByDate = new Map(trainings.map((training) => [training.datum, training.slug]));

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
      };
    })
    .sort((a, b) => a.datum.localeCompare(b.datum));
}

export function getUpcomingTraining(today = new Date()): PlannedTraining | undefined {
  const isoToday = format(today, "yyyy-MM-dd");

  return getPlannedTrainings().find((training) => training.datum >= isoToday);
}

export function getTrainingForDate(date: string): PlannedTraining | undefined {
  return getPlannedTrainings().find((training) => training.datum === date);
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

export function getVacationForDate(date: string) {
  const calendar = getSeasonCalendar();
  return calendar.vakanties.find((vakantie) => date >= vakantie.start && date <= vakantie.einde);
}

export function getCompetitionForDate(date: string) {
  const calendar = getSeasonCalendar();
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

    let status: WeekDag["status"] = "geen-training";
    let reden: string | undefined;

    if (vacation) {
      status = "vakantie";
      reden = vacation.naam;
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

export function getTodayCard(today = new Date()) {
  const isoToday = format(today, "yyyy-MM-dd");
  const training = getTrainingForDate(isoToday);
  const vacation = getVacationForDate(isoToday);
  const competition = getCompetitionForDate(isoToday);
  const upcoming = getUpcomingTraining(today);

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
    reason: vacation?.naam ?? competition?.naam ?? "Geen training vandaag",
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

export function getTrainingPageData(slug: string): TrainingPageData | undefined {
  const uitgewerkteTraining = getTrainingBySlug(slug);

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

  const geplandeTraining = getPlannedTrainings().find((training) => training.slug === slug);

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

export function getTrainingNavigation(slug: string): TrainingNavigation {
  const trainingen = getPlannedTrainings();
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
