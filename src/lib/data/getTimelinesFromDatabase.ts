import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  getTimelineById,
  getTimelines,
} from "@/lib/data/getTimelines";
import type { Timeline } from "@/types";

interface TimelineRow {
  slug: string;
  name: string;
  code: string;
  description: string;
  status: Timeline["status"];
  series: Array<{
    slug: string;
  }> | null;
}

export async function getTimelinesFromDatabase(): Promise<Timeline[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return getTimelines();
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("timelines")
      .select(`
        slug,
        name,
        code,
        description,
        status,
        series (
          slug
        )
      `)
      .order("code");

    if (error || !data?.length) {
      return getTimelines();
    }

    return (data as TimelineRow[]).map((timeline) => ({
      id: timeline.slug,
      name: timeline.name,
      code: timeline.code,
      description: timeline.description,
      status: timeline.status,
      seriesIds: (timeline.series ?? []).map((series) => series.slug),
    }));
  } catch {
    return getTimelines();
  }
}

export async function getTimelineByIdFromDatabase(
  id: string,
): Promise<Timeline | undefined> {
  const timelines = await getTimelinesFromDatabase();

  return (
    timelines.find((timeline) => timeline.id === id) ??
    getTimelineById(id)
  );
}