"use client";

import { useEffect, useRef, useState } from "react";

import type { BlockFeedbackRating, TrainingBlockDefinition } from "@/lib/types";

export type FeedbackBlock = TrainingBlockDefinition & {
  blockId: string;
};

type InlineBlockFeedbackProps = {
  block: FeedbackBlock;
  trainingSlug: string;
  datum: string;
};

type SubmitState = "idle" | "saving" | "saved" | "error";

const RATINGS: Array<{ value: BlockFeedbackRating; label: string }> = [
  { value: 1, label: "Niet goed" },
  { value: 2, label: "Bruikbaar" },
  { value: 3, label: "Goed" },
];

export function InlineBlockFeedback({ block, trainingSlug, datum }: InlineBlockFeedbackProps) {
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [rating, setRating] = useState<BlockFeedbackRating | undefined>();
  const [opmerking, setOpmerking] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [attentionActive, setAttentionActive] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  useEffect(() => {
    const feedbackElement = feedbackRef.current;
    if (!feedbackElement || !("IntersectionObserver" in window)) {
      return;
    }

    let attentionTimeout: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setAttentionActive(true);
        attentionTimeout = window.setTimeout(() => setAttentionActive(false), 3000);
        observer.unobserve(entry.target);
      },
      {
        rootMargin: "0px 0px -16% 0px",
        threshold: 0.65,
      },
    );

    observer.observe(feedbackElement);

    return () => {
      observer.disconnect();
      if (attentionTimeout) {
        window.clearTimeout(attentionTimeout);
      }
    };
  }, []);

  async function submitFeedback(nextRating: BlockFeedbackRating) {
    setRating(nextRating);
    setSubmitState("saving");

    const response = await fetch("/api/block-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blockId: block.blockId,
        trainingSlug,
        datum,
        rating: nextRating,
        opmerking,
      }),
    });

    setSubmitState(response.ok ? "saved" : "error");
  }

  return (
    <div ref={feedbackRef} className={attentionActive ? "inline-block-feedback inline-block-feedback--attention" : "inline-block-feedback"}>
      <div className="inline-block-feedback__main">
        <span className="inline-block-feedback__label">Beoordelen</span>
        <div className="inline-block-feedback__controls" aria-label={`Feedback voor blok ${block.nummer}`}>
          {RATINGS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={rating === option.value ? "inline-rating-button inline-rating-button--active" : "inline-rating-button"}
              onClick={() => void submitFeedback(option.value)}
              disabled={submitState === "saving"}
              aria-pressed={rating === option.value}
              aria-label={`${option.value} ster: ${option.label}`}
              title={option.label}
            >
              {"★".repeat(option.value)}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={noteOpen ? "inline-note-toggle inline-note-toggle--active" : "inline-note-toggle"}
          onClick={() => setNoteOpen((open) => !open)}
          aria-expanded={noteOpen}
          aria-controls={`feedback-note-${block.blockId}`}
        >
          Opmerking
        </button>

        <span
          className={
            submitState === "error"
              ? "inline-feedback-status inline-feedback-status--error"
              : submitState === "saved"
                ? "inline-feedback-status inline-feedback-status--saved"
                : "inline-feedback-status"
          }
          aria-live="polite"
        >
          {submitState === "saving" ? "..." : null}
          {submitState === "saved" ? "✓" : null}
          {submitState === "error" ? "!" : null}
        </span>
      </div>

      {noteOpen ? (
        <label className="inline-feedback-note" id={`feedback-note-${block.blockId}`}>
          <span className="sr-only">Opmerking bij blok {block.nummer}</span>
          <input
            value={opmerking}
            onChange={(event) => setOpmerking(event.target.value)}
            placeholder="Optioneel"
            disabled={submitState === "saving"}
          />
        </label>
      ) : null}
    </div>
  );
}
