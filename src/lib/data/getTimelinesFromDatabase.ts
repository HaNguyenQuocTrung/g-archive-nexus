import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import type { Timeline } from "@/types";

interface TimelineRow {
  slug: string;
  name: string;
  code: string;
  description: string;
  status: string;
  series: Array<{
    slug: string;
  }> | null;
}

function assertSupabaseConfiguration() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    throw new Error("Supabase public environment variables are missing.");
  }
}

export async function getTimelinesFromDatabase(): Promise<Timeline[]> {
  assertSupabaseConfiguration();

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("timelines")
    .select(
      `
      slug,
      name,
      code,
      description,
      status,
      series (
        slug
      )
    `,
    )
    .order("code");

  if (error) {
    throw new Error(`Unable to load timelines: ${error.message}`);
  }

  return (data as unknown as TimelineRow[]).map((timeline) => ({
    id: timeline.slug,
    name: timeline.name,
    code: timeline.code,
    description: timeline.description,
    status: timeline.status === "published" ? "published" : "draft",
    seriesIds: (timeline.series ?? []).map((series) => series.slug),
  }));
}

export async function getTimelineByIdFromDatabase(
  id: string,
): Promise<Timeline | undefined> {
  const timelines = await getTimelinesFromDatabase();

  return timelines.find((timeline) => timeline.id === id);
}
