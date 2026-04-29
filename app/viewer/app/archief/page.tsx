import type { Metadata } from "next";
import Link from "next/link";

import { formatDutchDate, getAllTrainings, resolveSeasonForDate } from "@/lib/content";
import { createArchiveMetadata } from "@/lib/metadata";
import { buildSeasonTrainingPath } from "@/lib/season";

export const metadata: Metadata = createArchiveMetadata();

export default function ArchiefPage() {
  const trainingen = getAllTrainings();

  return (
    <div className="stack-lg">
      <section className="panel stack-md">
        <div>
          <p className="eyebrow">Archief</p>
          <h1>Alle uitgewerkte trainingen</h1>
        </div>

        <div className="archive-list">
          {trainingen.map((training) => (
            <article key={training.slug} className="archive-row">
              <div>
                <strong>{formatDutchDate(training.datum)}</strong>
                <p>
                  {training.primair_thema}
                  {training.secundair_thema ? ` • ${training.secundair_thema}` : ""}
                </p>
                <p className="muted-small">
                  {training.slagfocus} • {training.totale_afstand_m}m
                </p>
              </div>
              <Link href={buildSeasonTrainingPath(resolveSeasonForDate(training.datum), training.slug)}>Open</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
