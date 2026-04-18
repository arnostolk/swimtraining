import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { formatDutchDate, getAllTrainings, getPlannedTrainings, getTrainingPageData } from "@/lib/content";

export function generateStaticParams() {
  const slugs = new Set<string>();

  for (const training of getAllTrainings()) {
    slugs.add(training.slug);
  }

  for (const training of getPlannedTrainings()) {
    slugs.add(training.slug);
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const training = getTrainingPageData(slug);

  if (!training) {
    notFound();
  }

  return (
    <div className="stack-lg">
      <Link href="/week" className="back-link">
        Terug naar week
      </Link>

      <section className="panel stack-md">
        <div>
          <p className="eyebrow">Training</p>
          <h1>{training.primair_thema}</h1>
        </div>

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
      </section>

      {training.isUitgewerkt && training.content ? (
        <article className="panel markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{training.content}</ReactMarkdown>
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
            <Link href="/week" className="button-secondary">
              Terug naar week
            </Link>
            <Link href="/overzicht/trainingskalender" className="button-secondary">
              Open trainingskalender
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
