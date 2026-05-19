"use client";

import { cloneElement, useMemo, useState, type ReactElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { InlineBlockFeedback, type FeedbackBlock } from "@/components/block-feedback";

type TrainingMarkdownProps = {
  content: string;
  feedbackBlocks?: FeedbackBlock[];
  trainingSlug?: string;
  datum?: string;
};

function flattenText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(flattenText).join("");
  }

  if (children && typeof children === "object" && "props" in children) {
    const props = children.props as { children?: ReactNode };
    return flattenText(props.children ?? "");
  }

  return "";
}

type CoachInfo = {
  coachText?: string;
  rationaleText?: string;
};

function parseCoachInfo(text: string): CoachInfo {
  const match = text.match(/\{\{coach:\s*(.+?)\s*\}\}/i);

  if (!match) {
    return {
      coachText: undefined,
    };
  }

  const rawCoachInfo = match[1].trim();
  const rationaleMatch = rawCoachInfo.match(/^(.*?)\s*(?:\|\s*)?onderbouwing\s*:\s*(.+)$/i);

  if (rationaleMatch) {
    return {
      coachText: rationaleMatch[1].trim(),
      rationaleText: rationaleMatch[2].trim(),
    };
  }

  return {
    coachText: rawCoachInfo,
  };
}

function stripCoachText(children: ReactNode): ReactNode {
  if (typeof children === "string") {
    return children.replace(/\s*\{\{coach:\s*.+?\s*\}\}/i, "");
  }

  if (typeof children === "number") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map((child) => stripCoachText(child));
  }

  if (children && typeof children === "object" && "props" in children) {
    const element = children as ReactElement<{ children?: ReactNode }>;
    return cloneElement(element, {
      ...element.props,
      children: stripCoachText(element.props.children),
    });
  }

  return children;
}

function getBlockNumberFromHeading(text: string) {
  const match = text.match(/^Blok\s+([12])\b/i);
  return match ? Number(match[1]) : undefined;
}

function splitContentIntoSections(content: string) {
  const lines = content.split(/\r?\n/);
  const sections: Array<{ content: string; blockNumber?: number }> = [];
  let currentLines: string[] = [];
  let currentBlockNumber: number | undefined;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentLines.length > 0) {
        sections.push({
          content: currentLines.join("\n").trim(),
          blockNumber: currentBlockNumber,
        });
      }

      currentLines = [line];
      currentBlockNumber = getBlockNumberFromHeading(line.replace(/^##\s+/, ""));
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    sections.push({
      content: currentLines.join("\n").trim(),
      blockNumber: currentBlockNumber,
    });
  }

  return sections.filter((section) => section.content.length > 0);
}

function CoachBottomSheet({ coachInfo, onClose }: { coachInfo: CoachInfo; onClose: () => void }) {
  return (
    <div className="coach-sheet-backdrop" onClick={onClose} role="presentation">
      <div className="coach-sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Trainerinfo">
        <div className="coach-sheet__grabber" />
        <div className="coach-sheet__head">
          <strong>Trainerinfo</strong>
          <button type="button" className="coach-sheet__close" onClick={onClose} aria-label="Sluit trainerinfo">
            Sluiten
          </button>
        </div>
        <div className="coach-sheet__body">
          <div>
            <h3>Tip</h3>
            <p>{coachInfo.coachText}</p>
          </div>
          {coachInfo.rationaleText ? (
            <div>
              <h3>Onderbouwing</h3>
              <p>{coachInfo.rationaleText}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function TrainingMarkdown({ content, feedbackBlocks = [], trainingSlug, datum }: TrainingMarkdownProps) {
  const [activeCoachInfo, setActiveCoachInfo] = useState<CoachInfo | null>(null);
  const sections = useMemo(() => splitContentIntoSections(content), [content]);

  const components = useMemo(
    () => ({
      li(props: { children?: ReactNode }) {
        const rawText = flattenText(props.children ?? "");
        const coachInfo = parseCoachInfo(rawText);

        if (!coachInfo.coachText) {
          return <li>{props.children}</li>;
        }

        return (
          <li className="coach-line-item">
            <span
              className="coach-line-hitarea"
              onClick={() => setActiveCoachInfo(coachInfo)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveCoachInfo(coachInfo);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Open trainerinfo voor deze opdracht"
            >
              <span className="coach-line__content">{stripCoachText(props.children)}</span>
              <span className="coach-line__meta" aria-hidden="true">
                <span className="coach-line__badge">Tip</span>
              </span>
            </span>
          </li>
        );
      },
    }),
    [],
  );

  return (
    <>
      {sections.map((section, index) => {
        const feedbackBlock = feedbackBlocks.find((block) => block.nummer === section.blockNumber);

        return (
          <section key={`${section.blockNumber ?? "intro"}-${index}`} className={feedbackBlock ? "markdown-training-block" : undefined}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {section.content}
            </ReactMarkdown>
            {feedbackBlock && trainingSlug && datum ? (
              <InlineBlockFeedback block={feedbackBlock} trainingSlug={trainingSlug} datum={datum} />
            ) : null}
          </section>
        );
      })}

      {activeCoachInfo ? <CoachBottomSheet coachInfo={activeCoachInfo} onClose={() => setActiveCoachInfo(null)} /> : null}
    </>
  );
}
