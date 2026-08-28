import strikeGundam from "@/data/mobile-suits/gat-x105-strike.json";
import charZakuII from "@/data/mobile-suits/ms-06s-zaku-ii.json";
import rx782Gundam from "@/data/mobile-suits/rx-78-2.json";
import freedomGundam from "@/data/mobile-suits/zgmf-x10a-freedom.json";

import type { MobileSuit } from "@/types";

const mobileSuits: MobileSuit[] = [
  rx782Gundam,
  charZakuII,
  strikeGundam,
  freedomGundam,
] as MobileSuit[];

export function getMobileSuits(): MobileSuit[] {
  return mobileSuits;
}

export function getMobileSuitById(
  id: string,
): MobileSuit | undefined {
  return mobileSuits.find((mobileSuit) => mobileSuit.id === id);
}

export function getMobileSuitsBySeriesId(
  seriesId: string,
): MobileSuit[] {
  return mobileSuits.filter((mobileSuit) =>
    mobileSuit.seriesIds.includes(seriesId),
  );
}

export function getMobileSuitsByTimelineId(
  timelineId: string,
): MobileSuit[] {
  return mobileSuits.filter(
    (mobileSuit) => mobileSuit.timelineId === timelineId,
  );
}