import { redirect } from "next/navigation";

import { resolveSeasonForDate } from "@/lib/content";
import { buildSeasonPath } from "@/lib/season";

export const revalidate = 43_200;

export default function HomePage() {
  redirect(buildSeasonPath(resolveSeasonForDate(new Date())));
}