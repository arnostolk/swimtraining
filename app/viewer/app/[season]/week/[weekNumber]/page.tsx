import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClickableCard } from "@/components/clickable-card";
import {
  formatDutchDate,
  getAvailableSeasons,
  getSeasonWeekNumberForDate,
  getWeekAnchorForSeasonNumber,
  getWeekDaysForDate,
  resolveSeasonForDate,
  resolveSeasonFromSlug,
  shiftWeekAnchorDate,
} from "@/lib/content";
import { createWeekMetadata } from "@/lib/metadata";
import { buildSeasonPath, buildSeasonTrainingPath, buildSeasonWeekPath, toSeasonSlug } from "@/lib/season";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string; weekNumber: string }>;
}): Promise<Metadata> {
  const { season, weekNumber } = await params;
  const resolvedSeason = resolveSeasonFromSlug(season);
  const parsedWeekNumber = Number.parseInt(weekNumber, 10);
  const anchor = resolvedSeason && Number.isInteger(parsedWeekNumber)
    ? getWeekAnchorForSeasonNumber(resolvedSeason, parsedWeekNumber)
    : undefined;

  return createWeekMetadata(anchor);
}

export function generateStaticParams() {
  return getAvailableSeasons().map((seizoen) => ({ season: toSeasonSlug(seizoen) }));
}

export default async function SeasonWeekPage({
  params,
}: {
  params: Promise<{ season: string; weekNumber: string }>;
}) {
  const { season: seasonSlug, weekNumber } = await params;
  const season = resolveSeasonFromSlug(seasonSlug);
  const parsedWeekNumber = Number.parseInt(weekNumber, 10);

  if (!season || !Number.isInteger(parsedWeekNumber)) {
    notFound();
  }

  const weekAnchor = getWeekAnchorForSeasonNumber(season, parsedWeekNumber);

  if (!weekAnchor) {
    notFound();
  }

  const weekDays = getWeekDaysForDate(weekAnchor);
  const previousWeekNumber = getSeasonWeekNumberForDate(shiftWeekAnchorDate(weekAnchor, -1));
  const nextWeekNumber = getSeasonWeekNumberForDate(shiftWeekAnchorDate(weekAnchor, 1));
  const previousWeekHref = getWeekAnchorForSeasonNumber(season, previousWeekNumber)
    ? buildSeasonWeekPath(season, previousWeekNumber)
    : undefined;
  const nextWeekHref = getWeekAnchorForSeasonNumber(season, nextWeekNumber)
    ? buildSeasonWeekPath(season, nextWeekNumber)
    : undefined;

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div>
          <p className="eyebrow">Weekoverzicht</p>
          <h1>Seizoen {toSeasonSlug(season)} - week {parsedWeekNumber}</h1>
          <p className="muted-small">Week van {formatDutchDate(weekAnchor)}</p>
        </div>

        <div className="actions-row">
          <Link href={buildSeasonPath(season)} className="button-secondary">
            Seizoenhome
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="week-list">
          {weekDays.map((day) => (
            <ClickableCard
              key={day.datum}
              className={`week-row week-row--${day.status}`}
              href={day.training?.slug ? buildSeasonTrainingPath(resolveSeasonForDate(day.training.datum), day.training.slug) : undefined}
              ariaLabel={day.training?.slug ? `Open training ${day.training.primair_thema} van ${day.dagLabel}` : undefined}
            >
              <div>
                <strong>{day.dagLabel}</strong>
              </div>
              <div className="week-row__body">
                {day.training ? (
                  <>
                    <p className="week-status">
                      {day.status === "vandaag-training"
                        ? "Vandaag"
                        : day.status === "volgende-training"
                          ? "Volgende"
                          : "Training"}
                    </p>
                    <p>
                      {day.training.primair_thema} • {day.training.slagfocus}
                    </p>
                    <p className="muted-small">{day.training.sessievorm}</p>
                    <Link href={buildSeasonTrainingPath(resolveSeasonForDate(day.training.datum), day.training.slug)}>Open</Link>
                  </>
                ) : day.status === "vakantie" ? (
                  <>
                    <p className="week-status">Vakantie</p>
                    <p>Geen training - {day.reden}</p>
                  </>
                ) : day.status === "wedstrijd" ? (
                  <>
                    <p className="week-status">Wedstrijd</p>
                    <p>{day.reden}</p>
                  </>
                ) : (
                  <>
                    <p className="week-status">Geen training</p>
                  </>
                )}
              </div>
            </ClickableCard>
          ))}
        </div>
      </section>

      <section className="panel training-nav">
        {previousWeekHref ? (
          <Link href={previousWeekHref} className="button-secondary">
            Vorige week
          </Link>
        ) : (
          <span className="button-disabled">Vorige week</span>
        )}

        {nextWeekHref ? (
          <Link href={nextWeekHref} className="button-secondary">
            Volgende week
          </Link>
        ) : (
          <span className="button-disabled">Volgende week</span>
        )}
      </section>
    </div>
  );
}