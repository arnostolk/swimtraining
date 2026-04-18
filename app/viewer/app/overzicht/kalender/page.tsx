import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getOverviewDocument } from "@/lib/content";

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
