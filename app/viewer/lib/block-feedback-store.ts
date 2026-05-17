import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import type { BlockFeedbackEvent, BlockFeedbackInput, FeedbackStore } from "@/lib/types";

const ROOT = path.resolve(process.cwd(), "..", "..");
const LOCAL_FEEDBACK_ROOT = path.join(ROOT, "content", "blokken", "feedback-local");

function assertValidRating(rating: number): asserts rating is 1 | 2 | 3 {
  if (![1, 2, 3].includes(rating)) {
    throw new Error("Feedback rating moet 1, 2 of 3 zijn.");
  }
}

function safePathSegment(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function buildLocalFeedbackPath(event: BlockFeedbackEvent) {
  const date = event.createdAt.slice(0, 10);
  const [year, month] = date.split("-");
  const blockId = safePathSegment(event.blockId) || "unknown-block";

  return path.join(LOCAL_FEEDBACK_ROOT, year, month, blockId, `${event.id}.json`);
}

export function createBlockFeedbackEvent(input: BlockFeedbackInput, source: BlockFeedbackEvent["source"]): BlockFeedbackEvent {
  assertValidRating(input.rating);

  return {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    source,
  };
}

export const localFeedbackStore: FeedbackStore = {
  async saveFeedback(event) {
    const filePath = buildLocalFeedbackPath(event);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(event, null, 2)}\n`, "utf8");
  },
};

export const vercelBlobFeedbackStore: FeedbackStore = {
  async saveFeedback() {
    throw new Error(
      "Vercel Blob feedbackopslag is nog niet geconfigureerd. Voeg @vercel/blob en BLOB_READ_WRITE_TOKEN toe voordat FEEDBACK_STORE=vercel-blob wordt gebruikt.",
    );
  },
};

export function getFeedbackStore() {
  return process.env.FEEDBACK_STORE === "vercel-blob" ? vercelBlobFeedbackStore : localFeedbackStore;
}

export async function saveBlockFeedback(input: BlockFeedbackInput) {
  const store = getFeedbackStore();
  const source = store === vercelBlobFeedbackStore ? "vercel-blob" : "local";
  const event = createBlockFeedbackEvent(input, source);

  await store.saveFeedback(event);

  return event;
}
