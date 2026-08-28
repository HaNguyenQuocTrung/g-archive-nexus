import { validatePilotLogs } from "@/lib/validation/validatePilotLogs";
import { getCharacters } from "@/lib/data/getCharacters";
import { getMobileSuits } from "@/lib/data/getMobileSuits";
import { getAllSeries } from "@/lib/data/getSeries";
import { getTimelines } from "@/lib/data/getTimelines";

let validationCompleted = false;

export function validateArchiveRelations(): void {
  if (validationCompleted) {
    return;
  }

  const timelines = getTimelines();
  const seriesRecords = getAllSeries();
  const characters = getCharacters();
  const mobileSuits = getMobileSuits();

  const errors: string[] = [];

  const timelineIds = new Set(
    timelines.map((timeline) => timeline.id),
  );

  const seriesIds = new Set(
    seriesRecords.map((series) => series.id),
  );

  const characterIds = new Set(
    characters.map((character) => character.id),
  );

  const mobileSuitIds = new Set(
    mobileSuits.map((mobileSuit) => mobileSuit.id),
  );

  checkDuplicateIds(
    "Timeline",
    timelines.map((item) => item.id),
    errors,
  );

  checkDuplicateIds(
    "Series",
    seriesRecords.map((item) => item.id),
    errors,
  );

  checkDuplicateIds(
    "Character",
    characters.map((item) => item.id),
    errors,
  );

  checkDuplicateIds(
    "Mobile Suit",
    mobileSuits.map((item) => item.id),
    errors,
  );

  for (const timeline of timelines) {
    for (const seriesId of timeline.seriesIds) {
      if (!seriesIds.has(seriesId)) {
        errors.push(
          `Timeline "${timeline.id}" references missing ` +
            `Series "${seriesId}".`,
        );
      }
    }
  }

  for (const series of seriesRecords) {
    if (!timelineIds.has(series.timelineId)) {
      errors.push(
        `Series "${series.id}" references missing ` +
          `Timeline "${series.timelineId}".`,
      );
    }

    for (const characterId of series.characterIds) {
      if (!characterIds.has(characterId)) {
        errors.push(
          `Series "${series.id}" references missing ` +
            `Character "${characterId}".`,
        );
      }
    }

    for (const mobileSuitId of series.mobileSuitIds) {
      if (!mobileSuitIds.has(mobileSuitId)) {
        errors.push(
          `Series "${series.id}" references missing ` +
            `Mobile Suit "${mobileSuitId}".`,
        );
      }
    }
  }

  for (const character of characters) {
    for (const era of character.eras) {
      if (!seriesIds.has(era.seriesId)) {
        errors.push(
          `Character "${character.id}" references missing ` +
            `Series "${era.seriesId}".`,
        );
      }

      for (const mobileSuitId of era.pilotedUnitIds) {
        if (!mobileSuitIds.has(mobileSuitId)) {
          errors.push(
            `Character "${character.id}" references missing ` +
              `Mobile Suit "${mobileSuitId}".`,
          );
        }
      }
    }
  }

  for (const mobileSuit of mobileSuits) {
    if (!timelineIds.has(mobileSuit.timelineId)) {
      errors.push(
        `Mobile Suit "${mobileSuit.id}" references missing ` +
          `Timeline "${mobileSuit.timelineId}".`,
      );
    }

    for (const seriesId of mobileSuit.seriesIds) {
      if (!seriesIds.has(seriesId)) {
        errors.push(
          `Mobile Suit "${mobileSuit.id}" references missing ` +
            `Series "${seriesId}".`,
        );
      }
    }

    checkDuplicateIds(
      `Variant in ${mobileSuit.id}`,
      mobileSuit.variants.map((variant) => variant.id),
      errors,
    );
  }

  errors.push(...validatePilotLogs());
  
  if (errors.length > 0) {
    throw new Error(
      [
        "Archive relation validation failed:",
        ...errors.map((error) => `- ${error}`),
      ].join("\n"),
    );
  }

  validationCompleted = true;
}

function checkDuplicateIds(
  entityName: string,
  ids: string[],
  errors: string[],
): void {
  const encounteredIds = new Set<string>();

  for (const id of ids) {
    if (encounteredIds.has(id)) {
      errors.push(
        `${entityName} contains duplicate ID "${id}".`,
      );
    }

    encounteredIds.add(id);
  }
}
