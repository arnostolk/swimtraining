import { redirect } from "next/navigation";

import { getTrainingPageData, resolveSeasonForDate } from "@/lib/content";
import { buildSeasonTrainingPath } from "@/lib/season";

export const revalidate = 43_200;

export default async function LegacyTrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const training = getTrainingPageData(slug);

  if (!training) {
    redirect("/");
  }

  redirect(buildSeasonTrainingPath(resolveSeasonForDate(training.datum), training.slug));
}
