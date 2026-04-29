import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TrainingMarkdown } from "@/components/training-markdown";

import {
  formatDutchLongNumericDate,
  formatDutchDate,
  getAllTrainings,
  getPlannedTrainings,
  getSeasonWeekNumberForDate,
  getTrainingNavigation,
  getTrainingPageData,
  resolveSeasonForDate,
  resolveSeasonFromSlug,
} from "@/lib/content";
import { createTrainingMetadata } from "@/lib/metadata";
import { buildSeasonTrainingCalendarPath, buildSeasonTrainingPath, buildSeasonWeekPath } from "@/lib/season";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string; slug: string }>;
}): Promise<Metadata> {
  const { season, slug } = await params;
  const resolvedSeason = resolveSeasonFromSlug(season);

  return createTrainingMetadata(slug, resolvedSeason);
}

export function generateStaticParams() {
  const slugs = new Map<string, Set<string>>();

  for (const training of getAllTrainings()) {
    const season = resolveSeasonForDate(training.datum);
    const values = slugs.get(season) ?? new Set<string>();
    values.add(training.slug);
    slugs.set(season, values);
  }

  for (const training of getPlannedTrainings()) {
    const season = resolveSeasonForDate(training.datum);
    const values = slugs.get(season) ?? new Set<string>();
    values.add(training.slug);
    slugs.set(season, values);
  }

  return Array.from(slugs.entries()).flatMap(([season, seasonSlugs]) =>
    Array.from(seasonSlugs).map((slug) => ({
      season: season.slice(2, 4) + "-" + season.slice(7, 9),
      slug,
    })),
  );
}

export default async function SeasonTrainingDetailPage({
  params,
}: {
  params: Promise<{ season: string; slug: string }>;
}) {
  const { season: seasonSlug, slug } = await params;
  const season = resolveSeasonFromSlug(seasonSlug);

  if (!season) {
    notFound();
  }

  const training = getTrainingPageData(slug, season);

  if (!training || resolveSeasonForDate(training.datum) !== season) {
    notFound();
  }

  const navigation = getTrainingNavigation(slug, season);
  const weekHref = buildSeasonWeekPath(season, getSeasonWeekNumberForDate(training.datum));

  return (
    <div className="stack-lg">
      <Link href={weekHref} className="back-link">
        Terug naar week
      </Link>

      <section className="panel stack-md">
        <div>
          <p className="eyebrow">Training - {formatDutchLongNumericDate(training.datum)}</p>
          <h1>{training.primair_thema}</h1>
        </div>

        <details className="meta-accordion">
          <summary>Trainingsinformatie</summary>
          <dl className="meta-list">
            <div>
              <dt>Datum</dt>
              <dd>{formatDutchDate(training.datum)}</dd>
            </div>
            <div>
              <dt>Periode</dt>
              <dd>{training.periode}</dd>
            </div>
            <div>
              <dt>Primair thema</dt>
              <dd>{training.primair_thema}</dd>
            </div>
            {training.secundair_thema ? (
              <div>
                <dt>Secundair thema</dt>
                <dd>{training.secundair_thema}</dd>
              </div>
            ) : null}
            <div>
              <dt>Slagfocus</dt>
              <dd>{training.slagfocus}</dd>
            </div>
            <div>
              <dt>Afstand</dt>
              <dd>{training.totale_afstand_m ? `${training.totale_afstand_m}m` : "Nog niet ingevuld"}</dd>
            </div>
            <div>
              <dt>Duur</dt>
              <dd>{training.duur_min ? `${training.duur_min} min` : "Nog niet ingevuld"}</dd>
            </div>
          </dl>
        </details>
      </section>

      {training.isUitgewerkt && training.content ? (
        <article className="panel markdown-body">
          <TrainingMarkdown content={training.content} />
        </article>
      ) : (
        <section className="panel stack-md">
          <div>
            <p className="eyebrow">Nog niet uitgewerkt</p>
            <h2>Deze training staat al wel op de kalender</h2>
          </div>
          <p>
            Deze sessie is gepland, maar nog niet als volledige training uitgeschreven in Markdown.
          </p>
          <dl className="meta-list">
            <div>
              <dt>Reden</dt>
              <dd>{training.reden ?? "Nog geen extra toelichting"}</dd>
            </div>
          </dl>
          <div className="actions-row">
            <Link href={weekHref} className="button-secondary">
              Terug naar week
            </Link>
            <Link href={buildSeasonTrainingCalendarPath(season)} className="button-secondary">
              Open trainingskalender
            </Link>
          </div>
        </section>
      )}

      <section className="panel training-nav">
        {navigation.previous ? (
          <Link href={buildSeasonTrainingPath(season, navigation.previous.slug)} className="button-secondary">
            Vorige training
          </Link>
        ) : (
          <span className="button-disabled">Vorige training</span>
        )}

        <Link href={weekHref} className="button-secondary">
          Week overzicht
        </Link>

        {navigation.next ? (
          <Link href={buildSeasonTrainingPath(season, navigation.next.slug)} className="button-secondary">
            Volgende training
          </Link>
        ) : (
          <span className="button-disabled">Volgende training</span>
        )}
      </section>
    </div>
  );
}