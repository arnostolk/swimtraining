import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { MenuToggle } from "@/components/menu-toggle";
import { SeasonTitle } from "@/components/season-title";
import {
  formatSeasonShortLabel,
  getAvailableSeasons,
  getSeasonDefaultWeekAnchor,
  resolveSeasonForDate,
} from "@/lib/content";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oceanus Aalsmeer Trainingen",
  description: "Mobile-first viewer voor Oceanus-trainers met focus op vandaag en deze week.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeSeason = resolveSeasonForDate(new Date());
  const activeSeasonLabel = formatSeasonShortLabel(activeSeason);
  const seasons = getAvailableSeasons().map((seizoen) => ({
    seizoen,
    label: formatSeasonShortLabel(seizoen),
    href: `/?week=${getSeasonDefaultWeekAnchor(seizoen)}`,
  }));

  return (
    <html lang="nl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="app-shell">
          <header className="topbar">
            <Link href="/" className="brand">
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
            </Link>
            <MenuToggle seasons={seasons} />
          </header>
          <main className="page-wrap">{children}</main>
        </div>
      </body>
    </html>
  );
}
