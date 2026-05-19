import fs from "node:fs";

import { del, list } from "@vercel/blob";

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) {
    return;
  }

  const lines = fs.readFileSync(".env.local", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    process.env[key.trim()] ??= valueParts.join("=").trim().replace(/^["']|["']$/g, "");
  }
}

function getArgValue(name) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function safePathSegment(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function readPrivateJsonBlob(blob, token) {
  const response = await fetch(blob.url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Blob lezen mislukt voor ${blob.pathname}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function summarize(events) {
  const byBlock = new Map();

  for (const event of events) {
    const blockId = event.blockId ?? "zonder-blockId";
    const summary = byBlock.get(blockId) ?? {
      blockId,
      trainingSlug: event.trainingSlug,
      datum: event.datum,
      aantal: 0,
      som: 0,
      ratings: { 1: 0, 2: 0, 3: 0 },
      opmerkingen: [],
    };

    summary.aantal += 1;
    summary.som += event.rating;
    summary.ratings[event.rating] = (summary.ratings[event.rating] ?? 0) + 1;

    if (event.opmerking?.trim()) {
      summary.opmerkingen.push(event.opmerking.trim());
    }

    byBlock.set(blockId, summary);
  }

  return [...byBlock.values()].map(({ som, ...summary }) => ({
    ...summary,
    gemiddelde: Number((som / summary.aantal).toFixed(2)),
  }));
}

loadLocalEnv();

const token = process.env.BLOB_READ_WRITE_TOKEN;
const trainingSlug = getArgValue("trainingSlug");
const year = getArgValue("year");
const month = getArgValue("month");
const explicitPrefix = getArgValue("prefix");
const shouldClear = process.argv.includes("--clear");

if (!token) {
  console.error("BLOB_READ_WRITE_TOKEN ontbreekt. Zet deze in app/viewer/.env.local of in je shell.");
  process.exit(1);
}

const prefix =
  explicitPrefix ??
  (trainingSlug && year && month ? `feedback/${year}/${month}/${safePathSegment(trainingSlug)}` : "feedback/");

const blobs = [];
let cursor;

do {
  const result = await list({
    prefix,
    cursor,
    limit: 1000,
    token,
  });

  blobs.push(...result.blobs);
  cursor = result.cursor;
} while (cursor);

const events = [];

for (const blob of blobs) {
  events.push(await readPrivateJsonBlob(blob, token));
}

const filteredEvents = trainingSlug ? events.filter((event) => event.trainingSlug === trainingSlug) : events;

console.log(
  JSON.stringify(
    {
      prefix,
      blobs: blobs.length,
      events: filteredEvents.length,
      samenvatting: summarize(filteredEvents),
      feedback: filteredEvents,
    },
    null,
    2,
  ),
);

if (shouldClear) {
  const pathnamesToDelete = blobs
    .filter((blob, index) => filteredEvents.includes(events[index]))
    .map((blob) => blob.pathname);

  if (pathnamesToDelete.length > 0) {
    await del(pathnamesToDelete, { token });
  }

  console.error(`Verwijderd uit Blob: ${pathnamesToDelete.length}`);
}
