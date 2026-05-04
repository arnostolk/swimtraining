import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";

import { MenuToggle } from "@/components/menu-toggle";
import { SeasonHomeLink } from "@/components/season-home-link";
import { SeasonTitle } from "@/components/season-title";
import {
  getAvailableSeasons,
  getSeasonDefaultWeekAnchor,
  getSeasonWeekNumberForDate,
  resolveSeasonForDate,
} from "@/lib/content";
import {
  buildSeasonOverviewPath,
  buildSeasonPath,
  buildSeasonTrainingCalendarPath,
  buildSeasonWeekPath,
  toSeasonSlug,
} from "@/lib/season";
import { VIEWER_HOME_DESCRIPTION, VIEWER_HOME_TITLE } from "@/lib/metadata";

import "./globals.css";

export const revalidate = 43_200;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const viewerRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
    "max-image-preview": "none",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const metadata: Metadata = {
  title: VIEWER_HOME_TITLE,
  description: VIEWER_HOME_DESCRIPTION,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  robots: viewerRobots,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeSeason = resolveSeasonForDate(new Date());
  const activeSeasonLabel = toSeasonSlug(activeSeason);
  const seasons = getAvailableSeasons().map((seizoen) => ({
    seizoen,
    label: toSeasonSlug(seizoen),
    homeHref: buildSeasonPath(seizoen),
    weekHref: buildSeasonWeekPath(seizoen, getSeasonWeekNumberForDate(getSeasonDefaultWeekAnchor(seizoen))),
    overviewHref: buildSeasonOverviewPath(seizoen),
    trainingCalendarHref: buildSeasonTrainingCalendarPath(seizoen),
  }));

  return (
    <html lang="nl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="app-shell">
          <header className="topbar">
            <SeasonHomeLink activeSeason={activeSeason} availableSeasons={getAvailableSeasons()}>
              <Image
                src="https://www.oceanusaalsmeer.nl/wp-content/uploads/logo-Oceanus-Aalsmeer.svg"
                alt="Oceanus Aalsmeer"
                className="brand-logo"
                width={200}
                height={80}
                priority
              />
              <Suspense fallback={<span className="brand-text">Trainingen {activeSeasonLabel}</span>}>
                <SeasonTitle fallbackSeasonLabel={activeSeasonLabel} availableSeasons={getAvailableSeasons()} />
              </Suspense>
            </SeasonHomeLink>
            <MenuToggle activeSeason={activeSeason} seasons={seasons} />
          </header>
          <main className="page-wrap">{children}</main>
        </div>
      </body>
    </html>
  );
}
