import { NextResponse } from "next/server";

import { saveBlockFeedback } from "@/lib/block-feedback-store";
import type { BlockFeedbackInput } from "@/lib/types";

type FeedbackRequestBody = Partial<BlockFeedbackInput>;

function isValidRating(value: unknown): value is 1 | 2 | 3 {
  return value === 1 || value === 2 || value === 3;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

export async function POST(request: Request) {
  const body = (await request.json()) as FeedbackRequestBody;

  if (!body.blockId || typeof body.blockId !== "string") {
    return NextResponse.json({ error: "blockId is verplicht." }, { status: 400 });
  }

  if (!isValidRating(body.rating)) {
    return NextResponse.json({ error: "rating moet 1, 2 of 3 zijn." }, { status: 400 });
  }

  const event = await saveBlockFeedback({
    blockId: body.blockId,
    trainingSlug: optionalString(body.trainingSlug),
    datum: optionalString(body.datum),
    rating: body.rating,
    opmerking: optionalString(body.opmerking),
    trainer: optionalString(body.trainer),
  });

  return NextResponse.json({ ok: true, event });
}
