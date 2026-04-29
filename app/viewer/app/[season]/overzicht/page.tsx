import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getAvailableSeasons, getOverviewDocument, resolveSeasonFromSlug } from "@/lib/content";
import { createSeasonOverviewMetadata } from "@/lib/metadata";
import { buildSeasonOverviewPath, buildSeasonTrainingCalendarPath, toSeasonSlug } from "@/lib/season";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string }>;
}): Promise<Metadata> {
  const { season } = await params;
  const resolvedSeason = resolveSeasonFromSlug(season);

  return createSeasonOverviewMetadata("kalender", resolvedSeason ?? getAvailableSeasons()[0]);
}

export default async function SeasonOverviewPage({
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
  const content = getOverviewDocument(season, "kalender");

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div>
          <p className="eyebrow">Overzicht</p>
          <h1>Seizoen {toSeasonSlug(season)}</h1>
        </div>

        <div className="season-tabs">
          {seasons.map((currentSeason) => (
            <Link
              key={currentSeason}
              href={buildSeasonOverviewPath(currentSeason)}
              className={currentSeason === season ? "season-tab season-tab--active" : "season-tab"}
            >
              {toSeasonSlug(currentSeason)}
            </Link>
          ))}
        </div>

        <div className="actions-row">
          <Link href={buildSeasonTrainingCalendarPath(season)} className="button-secondary">
            Open trainingskalender
          </Link>
        </div>
      </section>

      <article className="panel markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}