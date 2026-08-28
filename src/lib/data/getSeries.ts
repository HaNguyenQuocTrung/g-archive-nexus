import gundamSeedFreedom from "@/data/series/gundam-seed-freedom.json";
import gundam0079 from "@/data/series/gundam-0079.json";
import gundamSeed from "@/data/series/gundam-seed.json";

import { seriesSchema } from "@/lib/validation/schemas";
import type { Series } from "@/types";

const seriesRecords: Series[] = seriesSchema
  .array()
  .parse([
    gundam0079,
    gundamSeed,
    gundamSeedFreedom,
  ]);

export function getAllSeries(): Series[] {
  return seriesRecords;
}

export function getSeriesById(
  id: string,
): Series | undefined {
  return seriesRecords.find(
    (series) => series.id === id,
  );
}

export function getSeriesByTimelineId(
  timelineId: string,
): Series[] {
  return seriesRecords.filter(
    (series) => series.timelineId === timelineId,
  );
}