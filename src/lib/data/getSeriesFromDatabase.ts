import "server-only";

import { getAllSeries, getSeriesById } from "@/lib/data/getSeries";
import { createClient } from "@/lib/supabase/server";
import type { Series } from "@/types";

interface SeriesRow {
  slug: string;
  title: string;
  titles: {
    en?: string;
    ja?: string;
    vi?: string;
  } | null;
  format: Series["mediaType"] | null;
  in_universe_year: string | null;
  release_year: number | null;
  director: string | null;
  synopsis: string;
  status: string;
  timelines:
    | {
        slug: string;
      }
    | Array<{
        slug: string;
      }>
    | null;
  series_characters: Array<{
    characters:
      | {
          slug: string;
        }
      | Array<{
          slug: string;
        }>
      | null;
  }> | null;
  series_mobile_suits: Array<{
    mobile_suits:
      | {
          slug: string;
        }
      | Array<{
          slug: string;
        }>
      | null;
  }> | null;
}

function getRelatedSlug(
  relation: { slug: string } | Array<{ slug: string }> | null,
): string | undefined {
  if (Array.isArray(relation)) {
    return relation[0]?.slug;
  }

  return relation?.slug;
}

export async function getAllSeriesFromDatabase(): Promise<Series[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return getAllSeries();
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("series")
      .select(
        `
        slug,
        title,
        titles,
        format,
        in_universe_year,
        release_year,
        director,
        synopsis,
        status,
        timelines (
          slug
        ),
        series_characters (
          characters (
            slug
          )
        ),
        series_mobile_suits (
          mobile_suits (
            slug
          )
        )
      `,
      )
      .order("release_year");

    if (error || !data?.length) {
      return getAllSeries();
    }

    return (data as SeriesRow[]).map((record) => ({
      id: record.slug,
      titles: {
        en: record.titles?.en ?? record.title,
        ja: record.titles?.ja,
        vi: record.titles?.vi,
      },
      timelineId: getRelatedSlug(record.timelines) ?? "unknown",
      mediaType: record.format ?? "tv-series",
      inUniverseYear: record.in_universe_year ?? "Unknown",
      releaseYear: record.release_year ?? 0,
      director: record.director ?? undefined,
      synopsis: record.synopsis,
      characterIds: (record.series_characters ?? [])
        .map((relation) => getRelatedSlug(relation.characters))
        .filter((slug): slug is string => Boolean(slug)),
      mobileSuitIds: (record.series_mobile_suits ?? [])
        .map((relation) => getRelatedSlug(relation.mobile_suits))
        .filter((slug): slug is string => Boolean(slug)),
      status: record.status === "published" ? "published" : "draft",
    }));
  } catch {
    return getAllSeries();
  }
}

export async function getSeriesByIdFromDatabase(
  id: string,
): Promise<Series | undefined> {
  const records = await getAllSeriesFromDatabase();

  return records.find((series) => series.id === id) ?? getSeriesById(id);
}

export async function getSeriesByTimelineIdFromDatabase(
  timelineId: string,
): Promise<Series[]> {
  const records = await getAllSeriesFromDatabase();

  return records.filter((series) => series.timelineId === timelineId);
}
