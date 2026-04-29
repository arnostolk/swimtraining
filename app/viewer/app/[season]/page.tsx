import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClickableCard } from "@/components/clickable-card";
import {
  formatDutchDate,
  getPlannedTrainings,
  getSeasonDefaultWeekAnchor,
  getSeasonWeekNumberForDate,
  getTodayCard,
  getWeekDaysForDate,
  resolveSeasonForDate,
  resolveSeasonFromSlug,
  getAvailableSeasons,
} from "@/lib/content";
import { createSeasonHomeMetadata } from "@/lib/metadata";
import {
  buildSeasonOverviewPath,
  buildSeasonTrainingCalendarPath,
  buildSeasonTrainingPath,
  buildSeasonWeekPath,
  toSeasonSlug,
} from "@/lib/season";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string }>;
}): Promise<Metadata> {
  const { season } = await params;
  const resolvedSeason = resolveSeasonFromSlug(season);

  return createSeasonHomeMetadata(resolvedSeason ?? resolveSeasonForDate(new Date()));
}

export function generateStaticParams() {
  return getAvailableSeasons().map((seizoen) => ({ season: toSeasonSlug(seizoen) }));
}

export default async function SeasonHomePage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season: seasonSlug } = await params;
  const season = resolveSeasonFromSlug(seasonSlug);

  if (!season) {
    notFound();
  }

  const defaultWeekAnchor = getSeasonDefaultWeekAnchor(season);
  const defaultWeekNumber = getSeasonWeekNumberForDate(defaultWeekAnchor);
  const weekDays = getWeekDaysForDate(defaultWeekAnchor);
  const todayCard = getTodayCard(new Date(), season);
  const featuredTraining = todayCard.type === "training" ? todayCard.training : todayCard.nextTraining ?? getPlannedTrainings(season)[0];

  return (
    <div className="stack-lg">
      {featuredTraining ? (
        <ClickableCard
          className="hero-card"
          href={buildSeasonTrainingPath(resolveSeasonForDate(featuredTraining.datum), featuredTraining.slug)}
          ariaLabel={`Open training ${featuredTraining.primair_thema} van ${formatDutchDate(featuredTraining.datum)}`}
        >
          <p className="eyebrow">{todayCard.type === "training" ? "Vandaag" : "Eerstvolgende training"}</p>
          <h2>{featuredTraining.primair_thema}</h2>
          <p className="muted">{formatDutchDate(featuredTraining.datum)}</p>
          <p className="summary-line">
            {featuredTraining.slagfocus} • {featuredTraining.sessievorm}
          </p>
        </ClickableCard>
      ) : null}

      <section className="panel stack-md">
        <div>
          <p className="eyebrow">Seizoen</p>
          <h1>
            {toSeasonSlug(season)} week {defaultWeekNumber}
          </h1>
        </div>

        <div className="actions-row">
          <Link href={buildSeasonOverviewPath(season)} className="button-secondary">
            Overzicht
          </Link>
          <Link href={buildSeasonTrainingCalendarPath(season)} className="button-secondary">
            Trainingskalender
          </Link>
          <Link href={buildSeasonWeekPath(season, defaultWeekNumber)} className="button-primary">
            Open week {defaultWeekNumber}
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <h2>Week {defaultWeekNumber}</h2>
            <p className="muted-small">Week van {formatDutchDate(defaultWeekAnchor)}</p>
          </div>
        </div>

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
                  </>
                ) : day.status === "vakantie" ? (
                  <>
                    <p className="week-status">Vakantie</p>
                    <p>{day.reden}</p>
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

    </div>
  );
}