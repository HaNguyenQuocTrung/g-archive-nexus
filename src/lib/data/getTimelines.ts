import cosmicEra from "@/data/timelines/cosmic-era.json";
import universalCentury from "@/data/timelines/universal-century.json";

import { timelineSchema } from "@/lib/validation/schemas";
import type { Timeline } from "@/types";

const timelines: Timeline[] = timelineSchema
  .array()
  .parse([
    universalCentury,
    cosmicEra,
  ]);

export function getTimelines(): Timeline[] {
  return timelines;
}

export function getTimelineById(
  id: string,
): Timeline | undefined {
  return timelines.find(
    (timeline) => timeline.id === id,
  );
}