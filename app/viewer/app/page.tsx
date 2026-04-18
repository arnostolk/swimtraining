import Link from "next/link";

import { ClickableCard } from "@/components/clickable-card";
import { buildWeekDays, formatDutchDate, getTodayCard } from "@/lib/content";

export default function Home() {
  const todayCard = getTodayCard();
  const weekDays = buildWeekDays();

  return (
    <div className="stack-lg">
      <ClickableCard
        className="hero-card"
        href={todayCard.type === "training" ? `/trainingen/${todayCard.training.slug}` : undefined}
        ariaLabel={
          todayCard.type === "training"
            ? `Open training ${todayCard.training.primair_thema} van ${formatDutchDate(todayCard.training.datum)}`
            : undefined
        }
      >
        <p className="eyebrow">{todayCard.title}</p>

        {todayCard.type === "training" ? (
          <>
            <h1>{todayCard.training.primair_thema}</h1>
            <p className="muted">{formatDutchDate(todayCard.training.datum)}</p>
            <p className="summary-line">
              {todayCard.training.slagfocus} • {todayCard.training.sessievorm} • {todayCard.training.slug ? "uitgewerkt" : "gepland"}
            </p>
            <div className="actions-row">
              <Link href={`/trainingen/${todayCard.training.slug}`} className="button-primary">
                Open training
              </Link>
              <Link href="/week" className="button-secondary">
                Deze week
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>Geen training vandaag</h1>
            <p className="muted">Reden: {todayCard.reason}</p>
            {todayCard.nextTraining ? (
              <ClickableCard
                className="next-card"
                href={`/trainingen/${todayCard.nextTraining.slug}`}
                ariaLabel={`Open eerstvolgende training ${todayCard.nextTraining.primair_thema} van ${formatDutchDate(todayCard.nextTraining.datum)}`}
              >
                <p className="eyebrow">Eerstvolgende training</p>
                <strong>{todayCard.nextTraining.primair_thema}</strong>
                <p>{formatDutchDate(todayCard.nextTraining.datum)}</p>
                <p className="summary-line">
                  {todayCard.nextTraining.slagfocus} • {todayCard.nextTraining.sessievorm}
                </p>
                <Link href={`/trainingen/${todayCard.nextTraining.slug}`} className="button-primary">
                  Open training
                </Link>
              </ClickableCard>
            ) : null}
            <div className="actions-row">
              <Link href="/" className="button-secondary">
                Vandaag
              </Link>
              <Link href="/week" className="button-secondary">
                Deze week
              </Link>
            </div>
          </>
        )}
      </ClickableCard>

      <section className="panel">
        <div className="section-head">
          <h2>Deze week</h2>
          <Link href="/week">Volledig overzicht</Link>
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
