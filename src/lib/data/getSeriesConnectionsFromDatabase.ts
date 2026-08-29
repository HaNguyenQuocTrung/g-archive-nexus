import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import type { MediaType } from "@/types";

export type WorkRelationType =
  | "prequel"
  | "sequel"
  | "side-story"
  | "spin-off"
  | "compilation"
  | "remake"
  | "alternate-version";

export interface RelatedWork {
  id: string;
  title: string;
  mediaType?: MediaType;
  releaseYear?: number;
  relationType: WorkRelationType;
  direction: "outgoing" | "incoming";
  notes?: string;
}

export interface SeriesSource {
  id: string;
  title: string;
  url: string;
  publisher?: string;
  sourceType: string;
  isPrimary: boolean;
  notes?: string;
}

export interface SeriesConnections {
  relations: RelatedWork[];
  sources: SeriesSource[];
}

interface RelationRow {
  source_series_id: string;
  target_series_id: string;
  relation_type: WorkRelationType;
  notes: string | null;
}

interface RelatedSeriesRow {
  id: string;
  slug: string;
  title: string;
  media_type: MediaType | null;
  release_year: number | null;
}

interface SeriesSourceLinkRow {
  source_id: string;
  is_primary: boolean;
  notes: string | null;
}

interface ReferenceSourceRow {
  id: string;
  title: string;
  url: string;
  publisher: string | null;
  source_type: string;
}

export async function getSeriesConnectionsFromDatabase(
  seriesSlug: string,
): Promise<SeriesConnections> {
  const supabase = createPublicClient();

  const { data: seriesRecord, error: seriesError } = await supabase
    .from("series")
    .select("id")
    .eq("slug", seriesSlug)
    .maybeSingle();

  if (seriesError) {
    throw new Error(`Unable to load series identifier: ${seriesError.message}`);
  }

  if (!seriesRecord) {
    return {
      relations: [],
      sources: [],
    };
  }

  const seriesId = seriesRecord.id as string;

  const [
    { data: relationData, error: relationError },
    { data: sourceLinkData, error: sourceLinkError },
  ] = await Promise.all([
    supabase
      .from("work_relations")
      .select("source_series_id, target_series_id, relation_type, notes")
      .or(`source_series_id.eq.${seriesId},target_series_id.eq.${seriesId}`),
    supabase
      .from("series_sources")
      .select("source_id, is_primary, notes")
      .eq("series_id", seriesId),
  ]);

  if (relationError) {
    throw new Error(`Unable to load work relations: ${relationError.message}`);
  }

  if (sourceLinkError) {
    throw new Error(
      `Unable to load series sources: ${sourceLinkError.message}`,
    );
  }

  const relationRows = (relationData ?? []) as RelationRow[];
  const sourceLinks = (sourceLinkData ?? []) as SeriesSourceLinkRow[];

  const relatedSeriesIds = Array.from(
    new Set(
      relationRows.map((relation) =>
        relation.source_series_id === seriesId
          ? relation.target_series_id
          : relation.source_series_id,
      ),
    ),
  );

  const sourceIds = Array.from(
    new Set(sourceLinks.map((source) => source.source_id)),
  );

  const [
    { data: relatedSeriesData, error: relatedSeriesError },
    { data: sourceData, error: sourceError },
  ] = await Promise.all([
    relatedSeriesIds.length > 0
      ? supabase
          .from("series")
          .select("id, slug, title, media_type, release_year")
          .in("id", relatedSeriesIds)
      : Promise.resolve({
          data: [] as RelatedSeriesRow[],
          error: null,
        }),
    sourceIds.length > 0
      ? supabase
          .from("reference_sources")
          .select("id, title, url, publisher, source_type")
          .in("id", sourceIds)
      : Promise.resolve({
          data: [] as ReferenceSourceRow[],
          error: null,
        }),
  ]);

  if (relatedSeriesError) {
    throw new Error(
      `Unable to load related works: ${relatedSeriesError.message}`,
    );
  }

  if (sourceError) {
    throw new Error(`Unable to load reference sources: ${sourceError.message}`);
  }

  const relatedSeriesRows = (relatedSeriesData ?? []) as RelatedSeriesRow[];

  const sourceRows = (sourceData ?? []) as ReferenceSourceRow[];

  const relatedSeriesMap = new Map(
    relatedSeriesRows.map((record) => [record.id, record]),
  );

  const sourceMap = new Map(sourceRows.map((source) => [source.id, source]));

  const relationCandidates = relationRows.flatMap((relation): RelatedWork[] => {
    const direction =
      relation.source_series_id === seriesId ? "outgoing" : "incoming";

    const relatedId =
      direction === "outgoing"
        ? relation.target_series_id
        : relation.source_series_id;

    const relatedWork = relatedSeriesMap.get(relatedId);

    if (!relatedWork) {
      return [];
    }

    return [
      {
        id: relatedWork.slug,
        title: relatedWork.title,
        mediaType: relatedWork.media_type ?? undefined,
        releaseYear: relatedWork.release_year ?? undefined,
        relationType: relation.relation_type,
        direction,
        notes: relation.notes ?? undefined,
      },
    ];
  });

  const relationMap = new Map<string, RelatedWork>();

  for (const relation of relationCandidates) {
    const existing = relationMap.get(relation.id);

    if (
      !existing ||
      (relation.direction === "outgoing" && existing.direction === "incoming")
    ) {
      relationMap.set(relation.id, relation);
    }
  }

  const relations = Array.from(relationMap.values());

  relations.sort((first, second) => {
    const firstYear = first.releaseYear ?? Number.MAX_SAFE_INTEGER;
    const secondYear = second.releaseYear ?? Number.MAX_SAFE_INTEGER;

    return firstYear - secondYear || first.title.localeCompare(second.title);
  });
  const sources = sourceLinks.flatMap((link): SeriesSource[] => {
    const source = sourceMap.get(link.source_id);

    if (!source) {
      return [];
    }

    return [
      {
        id: source.id,
        title: source.title,
        url: source.url,
        publisher: source.publisher ?? undefined,
        sourceType: source.source_type,
        isPrimary: link.is_primary,
        notes: link.notes ?? undefined,
      },
    ];
  });

  sources.sort(
    (first, second) =>
      Number(second.isPrimary) - Number(first.isPrimary) ||
      first.title.localeCompare(second.title),
  );

  return {
    relations,
    sources,
  };
}
