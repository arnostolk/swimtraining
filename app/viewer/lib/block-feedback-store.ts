import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { put } from "@vercel/blob";

import type { BlockFeedbackEvent, BlockFeedbackInput, FeedbackStore } from "@/lib/types";

const ROOT = path.resolve(process.cwd(), "..", "..");

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
  return path.join(ROOT, buildFeedbackPath(event));
}

function buildFeedbackPath(event: BlockFeedbackEvent) {
  const date = event.createdAt.slice(0, 10);
  const [year, month] = date.split("-");
  const blockId = safePathSegment(event.blockId) || "unknown-block";

  return path.join("content", "blokken", "feedback-local", year, month, blockId, `${event.id}.json`);
}

function buildBlobFeedbackPath(event: BlockFeedbackEvent) {
  return buildFeedbackPath(event).replace(/\\/g, "/").replace("content/blokken/feedback-local/", "feedback/");
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
  async saveFeedback(event) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN ontbreekt. Stel deze environment variable in voordat Vercel Blob feedbackopslag wordt gebruikt.");
    }

    await put(buildBlobFeedbackPath(event), `${JSON.stringify(event, null, 2)}\n`, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    });
  },
};

export function getFeedbackStore() {
  if (process.env.FEEDBACK_STORE === "local") {
    return localFeedbackStore;
  }

  if (process.env.FEEDBACK_STORE === "vercel-blob" || process.env.BLOB_READ_WRITE_TOKEN) {
    return vercelBlobFeedbackStore;
  }

  return localFeedbackStore;
}

export async function saveBlockFeedback(input: BlockFeedbackInput) {
  const store = getFeedbackStore();
  const source = store === vercelBlobFeedbackStore ? "vercel-blob" : "local";
  const event = createBlockFeedbackEvent(input, source);

  await store.saveFeedback(event);

  return event;
}
