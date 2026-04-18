import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getOverviewDocument } from "@/lib/content";

export default function KalenderPage() {
  const content = getOverviewDocument("kalender");

  return (
    <article className="panel markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
