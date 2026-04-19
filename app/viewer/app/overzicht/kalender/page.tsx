import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getOverviewDocument } from "@/lib/content";
import { createSeasonOverviewMetadata } from "@/lib/metadata";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ seizoen?: string }>;
}): Promise<Metadata> {
  const { seizoen } = await searchParams;
  return createSeasonOverviewMetadata("kalender", seizoen ?? "2026-2027");
}

export default async function KalenderPage({
  searchParams,
}: {
  searchParams: Promise<{ seizoen?: string }>;
}) {
  const { seizoen } = await searchParams;
  const content = getOverviewDocument(seizoen ?? "2026-2027", "kalender");

  return (
    <article className="panel markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
