import amuroRay from "@/data/characters/amuro-ray.json";
import athrunZala from "@/data/characters/athrun-zala.json";
import charAznable from "@/data/characters/char-aznable.json";
import kiraYamato from "@/data/characters/kira-yamato.json";

import { characterSchema } from "@/lib/validation/schemas";
import type { Character } from "@/types";

const characters: Character[] = characterSchema
  .array()
  .parse([
    amuroRay,
    charAznable,
    kiraYamato,
    athrunZala,
  ]);

export function getCharacters(): Character[] {
  return characters;
}

export function getCharacterById(
  id: string,
): Character | undefined {
  return characters.find(
    (character) => character.id === id,
  );
}

export function getCharactersBySeriesId(
  seriesId: string,
): Character[] {
  return characters.filter((character) =>
    character.eras.some(
      (era) => era.seriesId === seriesId,
    ),
  );
}