"use client";

import { cloneElement, useMemo, useState, type ReactElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TrainingMarkdownProps = {
  content: string;
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

function parseCoachInfo(text: string) {
  const match = text.match(/\{\{coach:\s*(.+?)\s*\}\}/i);

  if (!match) {
    return {
      coachText: undefined,
    };
  }

  return {
    coachText: match[1].trim(),
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

function CoachBottomSheet({ coachText, onClose }: { coachText: string; onClose: () => void }) {
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
        <p>{coachText}</p>
      </div>
    </div>
  );
}

export function TrainingMarkdown({ content }: TrainingMarkdownProps) {
  const [activeCoachText, setActiveCoachText] = useState<string | null>(null);

  const components = useMemo(
    () => ({
      li(props: { children?: ReactNode }) {
        const rawText = flattenText(props.children ?? "");
        const { coachText } = parseCoachInfo(rawText);

        if (!coachText) {
          return <li>{props.children}</li>;
        }

        return (
          <li className="coach-line-item">
            <span
              className="coach-line-hitarea"
              onClick={() => setActiveCoachText(coachText)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveCoachText(coachText);
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
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>

      {activeCoachText ? <CoachBottomSheet coachText={activeCoachText} onClose={() => setActiveCoachText(null)} /> : null}
    </>
  );
}
