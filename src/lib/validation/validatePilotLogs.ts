import { getCharacters } from "@/lib/data/getCharacters";
import { getMobileSuits } from "@/lib/data/getMobileSuits";
import { getPilotLogs } from "@/lib/data/getPilotLogs";
import { getAllSeries } from "@/lib/data/getSeries";

export function validatePilotLogs(): string[] {
  const errors: string[] = [];

  const characters = getCharacters();
  const mobileSuits = getMobileSuits();
  const seriesRecords = getAllSeries();
  const pilotLogs = getPilotLogs();

  const encounteredLogIds = new Set<string>();

  for (const log of pilotLogs) {
    if (encounteredLogIds.has(log.id)) {
      errors.push(
        `Pilot Log contains duplicate ID "${log.id}".`,
      );
    }

    encounteredLogIds.add(log.id);

    const character = characters.find(
      (item) => item.id === log.characterId,
    );

    if (!character) {
      errors.push(
        `Pilot Log "${log.id}" references missing ` +
          `Character "${log.characterId}".`,
      );
    }

    const characterEra = character?.eras.find(
      (era) => era.id === log.characterEraId,
    );

    if (character && !characterEra) {
      errors.push(
        `Pilot Log "${log.id}" references missing ` +
          `Character Era "${log.characterEraId}".`,
      );
    }

    const mobileSuit = mobileSuits.find(
      (item) => item.id === log.mobileSuitId,
    );

    if (!mobileSuit) {
      errors.push(
        `Pilot Log "${log.id}" references missing ` +
          `Mobile Suit "${log.mobileSuitId}".`,
      );
    }

    const variant = mobileSuit?.variants.find(
      (item) => item.id === log.variantId,
    );

    if (mobileSuit && !variant) {
      errors.push(
        `Pilot Log "${log.id}" references missing ` +
          `Variant "${log.variantId}".`,
      );
    }

    const series = seriesRecords.find(
      (item) => item.id === log.seriesId,
    );

    if (!series) {
      errors.push(
        `Pilot Log "${log.id}" references missing ` +
          `Series "${log.seriesId}".`,
      );
    }

    if (
      characterEra &&
      characterEra.seriesId !== log.seriesId
    ) {
      errors.push(
        `Pilot Log "${log.id}" has a Series that does ` +
          "not match its Character Era.",
      );
    }

    if (
      mobileSuit &&
      !mobileSuit.seriesIds.includes(log.seriesId)
    ) {
      errors.push(
        `Pilot Log "${log.id}" has a Series that is ` +
          "not registered for its Mobile Suit.",
      );
    }
  }

  return errors;
}

