import { randomUUID } from "node:crypto";
import fs from "node:fs";

import { put } from "@vercel/blob";

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

loadLocalEnv();

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN ontbreekt. Zet deze in app/viewer/.env.local of in je shell.");
  process.exit(1);
}

const createdAt = new Date().toISOString();
const id = randomUUID();
const blockId = getArgValue("blockId") ?? "local-blob-test";
const trainingSlug = getArgValue("trainingSlug") ?? "local-blob-test-training";
const rating = Number(getArgValue("rating") ?? 3);

if (![1, 2, 3].includes(rating)) {
  console.error("rating moet 1, 2 of 3 zijn.");
  process.exit(1);
}

const [year, month] = createdAt.slice(0, 10).split("-");
const pathname = `feedback/${year}/${month}/${safePathSegment(blockId)}/${id}.json`;
const event = {
  id,
  blockId,
  trainingSlug,
  rating,
  opmerking: "Lokale test naar Vercel Blob",
  createdAt,
  source: "vercel-blob",
};

const blob = await put(pathname, `${JSON.stringify(event, null, 2)}\n`, {
  access: "private",
  contentType: "application/json",
  addRandomSuffix: false,
});

console.log(`Blob feedback-test opgeslagen: ${blob.pathname}`);
