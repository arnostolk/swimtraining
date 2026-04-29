import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClickableCard } from "@/components/clickable-card";

import {
  formatDutchDate,
  getAvailableSeasons,
  getPlannedTrainings,
  getSeasonCalendar,
  getSeasonWeekNumberForDate,
  resolveSeasonForDate,
  resolveSeasonFromSlug,
} from "@/lib/content";
import { createSeasonOverviewMetadata } from "@/lib/metadata";
import {
  buildSeasonOverviewPath,
  buildSeasonTrainingCalendarPath,
  buildSeasonTrainingPath,
  toSeasonSlug,
} from "@/lib/season";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string }>;
}): Promise<Metadata> {
  const { season } = await params;
  const resolvedSeason = resolveSeasonFromSlug(season);

  return createSeasonOverviewMetadata("trainingskalender", resolvedSeason ?? getAvailableSeasons()[0]);
}

type CalendarEntry =
  | {
      type: "training";
      datum: string;
      slug: string;
      periode: string;
      primair_thema: string;
      secundair_thema?: string;
      sessievorm: string;
      slagfocus: string;
      reden: string;
    }
  | {
      type: "wedstrijd";
      datum: string;
      naam: string;
    };

type MonthGroup = {
  monthLabel: string;
  items: CalendarEntry[];
};

type WeekGroup = {
  weekNumber: number;
  items: CalendarEntry[];
};

function monthLabelFromDate(date: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function groupEntriesByWeek(items: CalendarEntry[]) {
  return items.reduce<WeekGroup[]>((groups, entry) => {
    const weekNumber = getSeasonWeekNumberForDate(entry.datum);
    const existingGroup = groups.find((group) => group.weekNumber === weekNumber);

    if (existingGroup) {
      existingGroup.items.push(entry);
      return groups;
    }

    groups.push({
      weekNumber,
      items: [entry],
    });

    return groups;
  }, []);
}

export default async function SeasonTrainingCalendarPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season: seasonSlug } = await params;
  const season = resolveSeasonFromSlug(seasonSlug);

  if (!season) {
    notFound();
  }

  const seasons = getAvailableSeasons();
  const trainingen = getPlannedTrainings(season);
  const wedstrijden = getSeasonCalendar(season).wedstrijden;

  const entries: CalendarEntry[] = [
    ...trainingen.map((training) => ({
      type: "training" as const,
      datum: training.datum,
      slug: training.slug,
      periode: training.periode,
      primair_thema: training.primair_thema,
      secundair_thema: training.secundair_thema,
      sessievorm: training.sessievorm,
      slagfocus: training.slagfocus,
      reden: training.reden,
    })),
    ...wedstrijden.map((wedstrijd) => ({
      type: "wedstrijd" as const,
      datum: wedstrijd.datum,
      naam: wedstrijd.naam,
    })),
  ].sort((a, b) => a.datum.localeCompare(b.datum) || a.type.localeCompare(b.type));

  const grouped = entries.reduce<MonthGroup[]>((groups, entry) => {
    const label = monthLabelFromDate(entry.datum);
    const existingGroup = groups.find((group) => group.monthLabel === label);

    if (existingGroup) {
      existingGroup.items.push(entry);
      return groups;
    }

    groups.push({
      monthLabel: label,
      items: [entry],
    });

    return groups;
  }, []);

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div>
          <p className="eyebrow">Trainingskalender</p>
          <h1>Seizoen {toSeasonSlug(season)}</h1>
        </div>

        <div className="season-tabs">
          {seasons.map((currentSeason) => (
            <Link
              key={currentSeason}
              href={buildSeasonTrainingCalendarPath(currentSeason)}
              className={currentSeason === season ? "season-tab season-tab--active" : "season-tab"}
            >
              {toSeasonSlug(currentSeason)}
            </Link>
          ))}
        </div>

        <div className="actions-row">
          <Link href={buildSeasonOverviewPath(season)} className="button-secondary">
            Open seizoensoverzicht
          </Link>
        </div>
      </section>

      {grouped.map((group) => (
        <section key={group.monthLabel} className="panel stack-md">
          <div className="section-head">
            <h2>{group.monthLabel}</h2>
          </div>

          <div className="calendar-training-list">
            {groupEntriesByWeek(group.items).map((weekGroup) => (
              <section key={`${group.monthLabel}-week-${weekGroup.weekNumber}`} className="calendar-week-group">
                <div className="calendar-week-group__head">
                  <p className="calendar-week-group__label">Week {weekGroup.weekNumber}</p>
                </div>

                <div className="calendar-week-group__items">
                  {weekGroup.items.map((entry) =>
                    entry.type === "training" ? (
                      <ClickableCard
                        key={entry.slug}
                        className="calendar-training-card"
                        href={buildSeasonTrainingPath(resolveSeasonForDate(entry.datum), entry.slug)}
                        ariaLabel={`Open training ${entry.primair_thema} van ${formatDutchDate(entry.datum)}`}
                      >
                        <div className="calendar-training-card__head">
                          <strong>{formatDutchDate(entry.datum)}</strong>
                        </div>

                        <div className="calendar-training-card__meta">
                          <span>{entry.periode}</span>
                          <span>{entry.sessievorm}</span>
                          <span>{entry.slagfocus}</span>
                        </div>

                        <p className="calendar-training-card__themes">
                          {entry.primair_thema}
                          {entry.secundair_thema ? ` • ${entry.secundair_thema}` : ""}
                        </p>

                        <p className="muted-small">{entry.reden}</p>
                      </ClickableCard>
                    ) : (
                      <article key={`${entry.datum}-${entry.naam}`} className="calendar-training-card calendar-training-card--competition">
                        <div className="calendar-training-card__head">
                          <strong>{formatDutchDate(entry.datum)}</strong>
                          <span className="competition-label">Wedstrijd</span>
                        </div>

                        <p className="calendar-training-card__themes">{entry.naam}</p>
                        <p className="muted-small">Deze wedstrijddag komt uit de seizoenskalender.</p>
                      </article>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}