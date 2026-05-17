import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import type { TrainingBlock, TrainingBlockSource, TrainingBlockStatus, TrainingBlockType } from "@/lib/types";

const ROOT = path.resolve(process.cwd(), "..", "..");
const BLOCKS_ROOT = path.join(ROOT, "content", "blokken");

type BlockFrontmatter = {
  id: string;
  type: TrainingBlockType;
  thema: string;
  slagfocus: string;
  afstand_m: number;
  status?: TrainingBlockStatus;
  bron?: TrainingBlockSource;
  rating?: {
    gemiddelde?: number;
    aantal?: number;
  };
  tags?: string[];
};

function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return entry.name === "feedback-local" ? [] : walkMarkdownFiles(fullPath);
    }

    return entry.name.endsWith(".md") ? [fullPath] : [];
  });
}

function assertRequiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Blok mist verplicht veld "${field}".`);
  }

  return value;
}

function assertRequiredNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Blok mist verplicht numeriek veld "${field}".`);
  }

  return value;
}

export function getAllTrainingBlocks(): TrainingBlock[] {
  return walkMarkdownFiles(BLOCKS_ROOT)
    .map((filePath) => {
      const file = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(file);
      const frontmatter = data as Partial<BlockFrontmatter>;

      return {
        id: assertRequiredString(frontmatter.id, "id"),
        type: assertRequiredString(frontmatter.type, "type") as TrainingBlockType,
        thema: assertRequiredString(frontmatter.thema, "thema"),
        slagfocus: assertRequiredString(frontmatter.slagfocus, "slagfocus"),
        afstand_m: assertRequiredNumber(frontmatter.afstand_m, "afstand_m"),
        status: frontmatter.status ?? "concept",
        bron: frontmatter.bron,
        rating: frontmatter.rating
          ? {
              gemiddelde: frontmatter.rating.gemiddelde ?? 0,
              aantal: frontmatter.rating.aantal ?? 0,
            }
          : undefined,
        tags: frontmatter.tags ?? [],
        content: content.trim(),
        path: filePath,
      } satisfies TrainingBlock;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getTrainingBlockById(id: string) {
  return getAllTrainingBlocks().find((block) => block.id === id);
}
