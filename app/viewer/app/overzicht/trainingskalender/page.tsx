import type { Metadata } from "next";
import Link from "next/link";

import {
  formatDutchDate,
  formatSeasonShortLabel,
  getAvailableSeasons,
  getPlannedTrainings,
  getSeasonCalendar,
  resolveSeasonForDate,
} from "@/lib/content";
import { createSeasonOverviewMetadata } from "@/lib/metadata";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ seizoen?: string }>;
}): Promise<Metadata> {
  const { seizoen } = await searchParams;
  return createSeasonOverviewMetadata("trainingskalender", seizoen ?? resolveSeasonForDate(new Date()));
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

function monthLabelFromDate(date: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function TrainingskalenderPage({
  searchParams,
}: {
  searchParams: Promise<{ seizoen?: string }>;
}) {
  const { seizoen } = await searchParams;
  const activeSeason = seizoen ?? resolveSeasonForDate(new Date());
  const seasons = getAvailableSeasons();
  const trainingen = getPlannedTrainings(activeSeason);
  const wedstrijden = getSeasonCalendar(activeSeason).wedstrijden;

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
          <h1>Seizoen {formatSeasonShortLabel(activeSeason)}</h1>
        </div>

        <div className="season-tabs">
          {seasons.map((season) => (
            <Link
              key={season}
              href={`/overzicht/trainingskalender?seizoen=${season}`}
              className={season === activeSeason ? "season-tab season-tab--active" : "season-tab"}
            >
              {formatSeasonShortLabel(season)}
            </Link>
          ))}
        </div>
      </section>

      {grouped.map((group) => (
        <section key={group.monthLabel} className="panel stack-md">
          <div className="section-head">
            <h2>{group.monthLabel}</h2>
          </div>

          <div className="calendar-training-list">
            {group.items.map((entry) =>
              entry.type === "training" ? (
                <article key={entry.slug} className="calendar-training-card">
                  <div className="calendar-training-card__head">
                    <strong>{formatDutchDate(entry.datum)}</strong>
                    <Link href={`/trainingen/${entry.slug}`}>Open</Link>
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
                </article>
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
  );
}
