import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import type { Series } from "@/types";

interface SeriesRow {
  slug: string;
  title: string;
  titles: {
    en?: string;
    ja?: string;
    vi?: string;
  } | null;
  media_type: Series["mediaType"] | null;
  in_universe_year: string | null;
  release_year: number | null;
  release_date: string | null;
  end_year: number | null;
  episode_count: number | null;
  runtime_minutes: number | null;
  director: string | null;
  synopsis: string;
  status: string;
  catalog_status: Series["catalogStatus"] | null;
  official_url: string | null;
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
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("series")
      .select(
        `
        slug,
        title,
        titles,
        media_type,
        in_universe_year,
        release_year,
                release_date,
        end_year,
        episode_count,
        runtime_minutes,
        director,
        synopsis,
        status,
                catalog_status,
        official_url,
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

    if (error) {
      throw new Error(`Unable to load series: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return (data as SeriesRow[]).map((record) => ({
      id: record.slug,
      releaseDate: record.release_date ?? undefined,
      endYear: record.end_year ?? undefined,
      episodeCount: record.episode_count ?? undefined,
      runtimeMinutes: record.runtime_minutes ?? undefined,
      titles: {
        en: record.titles?.en ?? record.title,
        ja: record.titles?.ja,
        vi: record.titles?.vi,
      },
      timelineId: getRelatedSlug(record.timelines) ?? "unknown",
      mediaType: record.media_type ?? "tv-series",
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
      catalogStatus: record.catalog_status ?? "planned",
      officialUrl: record.official_url ?? undefined,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to load series.");
  }
}

export async function getSeriesByIdFromDatabase(
  id: string,
): Promise<Series | undefined> {
  const records = await getAllSeriesFromDatabase();

  return records.find((series) => series.id === id);
}

export async function getSeriesByTimelineIdFromDatabase(
  timelineId: string,
): Promise<Series[]> {
  const records = await getAllSeriesFromDatabase();

  return records.filter((series) => series.timelineId === timelineId);
}
