import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
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
  title: "Oceanus Aalsmeer Trainingsviewer",
  description: "Mobile-first viewer voor Oceanus-trainers met focus op vandaag en deze week.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
              <span className="brand-text">Trainingsviewer</span>
            </Link>
            <nav className="topnav">
              <Link href="/">Vandaag</Link>
              <Link href="/week">Deze week</Link>
              <Link href="/archief">Archief</Link>
            </nav>
          </header>
          <main className="page-wrap">{children}</main>
        </div>
      </body>
    </html>
  );
}
