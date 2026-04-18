import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getOverviewDocument } from "@/lib/content";

export default function TrainingskalenderPage() {
  const content = getOverviewDocument("trainingskalender");

  return (
    <article className="panel markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
