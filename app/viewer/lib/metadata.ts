import type { Metadata } from "next";

import { formatDutchDate, getTrainingPageData } from "@/lib/content";
import { toSeasonSlug } from "@/lib/season";

export const VIEWER_HOME_TITLE = "Oceanus Aalsmeer Trainingen";
export const VIEWER_HOME_DESCRIPTION = "Training viewer";

export function createViewerMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}

export function createWeekMetadata(datum?: string): Metadata {
  if (!datum) {
    return createViewerMetadata("Weekoverzicht", "Bekijk de trainingsweek in de training viewer.");
  }

  return createViewerMetadata(
    `Weekoverzicht ${formatDutchDate(datum)}`,
    `Bekijk de trainingsweek vanaf ${formatDutchDate(datum)} in de training viewer.`,
  );
}

export function createArchiveMetadata(): Metadata {
  return createViewerMetadata("Archief trainingen", "Bekijk alle uitgewerkte trainingen in de training viewer.");
}

export function createSeasonHomeMetadata(seizoen: string): Metadata {
  const seasonLabel = toSeasonSlug(seizoen);

  return createViewerMetadata(
    `Trainingen ${seasonLabel}`,
    `Bekijk het seizoensoverzicht voor ${seasonLabel} in de training viewer.`,
  );
}

export function createSeasonOverviewMetadata(kind: "kalender" | "trainingskalender", seizoen: string): Metadata {
  const seasonLabel = toSeasonSlug(seizoen);

  if (kind === "kalender") {
    return createViewerMetadata(
      `Seizoenskalender ${seasonLabel}`,
      `Bekijk de seizoenskalender voor ${seasonLabel} in de training viewer.`,
    );
  }

  return createViewerMetadata(
    `Trainingskalender ${seasonLabel}`,
    `Bekijk de trainingskalender voor ${seasonLabel} in de training viewer.`,
  );
}

export function createTrainingMetadata(slug: string, seizoen?: string): Metadata {
  const training = getTrainingPageData(slug, seizoen);

  if (!training) {
    return createViewerMetadata("Training niet gevonden", "Deze training is niet beschikbaar in de training viewer.");
  }

  const formattedDate = formatDutchDate(training.datum);

  return createViewerMetadata(
    `Training ${formattedDate} • ${training.primair_thema} • ${training.slagfocus}`,
    `Bekijk de training van ${formattedDate} met focus op ${training.primair_thema} en ${training.slagfocus}.`,
  );
}