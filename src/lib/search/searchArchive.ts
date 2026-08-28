import { getCharacters } from "@/lib/data/getCharacters";
import { getMobileSuits } from "@/lib/data/getMobileSuits";
import { getAllSeries } from "@/lib/data/getSeries";
import { getTimelines } from "@/lib/data/getTimelines";

export type SearchRecordType =
  | "timeline"
  | "series"
  | "character"
  | "mobile-suit";

export interface ArchiveSearchRecord {
  id: string;
  type: SearchRecordType;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  keywords: string[];
}

export function buildSearchIndex(): ArchiveSearchRecord[] {
  const timelineRecords: ArchiveSearchRecord[] =
    getTimelines().map((timeline) => ({
      id: timeline.id,
      type: "timeline",
      title: timeline.name,
      subtitle: timeline.code,
      description: timeline.description,
      href: `/timelines/${timeline.id}`,
      keywords: [
        timeline.code,
        timeline.name,
        ...timeline.seriesIds,
      ],
    }));

  const seriesRecords: ArchiveSearchRecord[] =
    getAllSeries().map((series) => ({
      id: series.id,
      type: "series",
      title: series.titles.en,
      subtitle: `${series.inUniverseYear} // ${series.mediaType}`,
      description: series.synopsis,
      href: `/series/${series.id}`,
      keywords: [
        series.titles.en,
        series.titles.ja ?? "",
        series.titles.vi ?? "",
        series.inUniverseYear,
        series.timelineId,
        series.director ?? "",
        ...series.characterIds,
        ...series.mobileSuitIds,
      ],
    }));

  const characterRecords: ArchiveSearchRecord[] =
    getCharacters().map((character) => ({
      id: character.id,
      type: "character",
      title: character.canonicalName,
      subtitle:
        character.eras[0]?.faction ?? "Faction unknown",
      description:
        character.eras[0]?.biography ??
        "Personnel biography unavailable.",
      href: `/characters/${character.id}`,
      keywords: [
        character.canonicalName,
        character.japaneseName ?? "",
        character.voiceActors?.japanese ?? "",
        ...character.eras.flatMap((era) => [
          era.aliasName ?? "",
          era.faction,
          era.rank ?? "",
          era.seriesId,
          ...era.pilotedUnitIds,
        ]),
      ],
    }));

  const mobileSuitRecords: ArchiveSearchRecord[] =
    getMobileSuits().map((mobileSuit) => ({
      id: mobileSuit.id,
      type: "mobile-suit",
      title: mobileSuit.baseName,
      subtitle: mobileSuit.modelNumber,
      description:
        mobileSuit.variants[0]?.description ??
        "Mechanical description unavailable.",
      href: `/mobile-suits/${mobileSuit.id}`,
      keywords: [
        mobileSuit.baseName,
        mobileSuit.modelNumber,
        mobileSuit.manufacturer,
        mobileSuit.timelineId,
        ...mobileSuit.seriesIds,
        ...mobileSuit.factionIds,
        ...mobileSuit.variants.flatMap((variant) => [
          variant.formName,
          ...variant.armaments.map(
            (armament) => armament.name,
          ),
          ...variant.specialSystems.map(
            (system) => system.name,
          ),
        ]),
      ],
    }));

  return [
    ...timelineRecords,
    ...seriesRecords,
    ...characterRecords,
    ...mobileSuitRecords,
  ];
}