import Link from "next/link";

import { ClickableCard } from "@/components/clickable-card";
import { buildWeekDays, formatDutchDate, getWeekDaysForDate } from "@/lib/content";

export default async function WeekPage({
  searchParams,
}: {
  searchParams: Promise<{ datum?: string }>;
}) {
  const { datum } = await searchParams;
  const weekDays = datum ? getWeekDaysForDate(datum) : buildWeekDays();

  return (
    <div className="stack-lg">
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Deze week</p>
            <h1>Weekoverzicht</h1>
            {datum ? <p className="muted-small">Week van {formatDutchDate(datum)}</p> : null}
          </div>
        </div>

        <div className="week-list">
          {weekDays.map((day) => (
            <ClickableCard
              key={day.datum}
              className={`week-row week-row--${day.status}`}
              href={day.training?.slug ? `/trainingen/${day.training.slug}` : undefined}
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
                    {day.training.slug ? <Link href={`/trainingen/${day.training.slug}`}>Open</Link> : null}
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
    </div>
  );
}
