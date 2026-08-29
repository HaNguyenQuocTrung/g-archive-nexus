import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import type { Character, CharacterEra } from "@/types";

interface SlugRelation {
  slug: string;
}

interface VariantRelation {
  mobile_suits: SlugRelation | SlugRelation[] | null;
}

interface PilotAssignmentRow {
  mobile_suit_variants: VariantRelation | VariantRelation[] | null;
}

interface CharacterEraRow {
  legacy_id: string | null;
  affiliation: string | null;
  rank: string | null;
  biography: string;
  series: SlugRelation | SlugRelation[] | null;
  pilot_assignments: PilotAssignmentRow[] | null;
}

interface CharacterRow {
  slug: string;
  name: string;
  japanese_name: string | null;
  voice_actors: Character["voiceActors"] | null;
  status: string;
  character_eras: CharacterEraRow[] | null;
}

function firstRelation<T>(relation: T | T[] | null): T | undefined {
  return Array.isArray(relation) ? relation[0] : (relation ?? undefined);
}

function getPilotedUnitIds(assignments: PilotAssignmentRow[] | null): string[] {
  const ids = (assignments ?? []).flatMap((assignment) => {
    const variant = firstRelation(assignment.mobile_suit_variants);

    const mobileSuit = firstRelation(variant?.mobile_suits ?? null);

    return mobileSuit?.slug ? [mobileSuit.slug] : [];
  });

  return [...new Set(ids)];
}

export async function getCharactersFromDatabase(): Promise<Character[]> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("characters")
      .select(
        `
        slug,
        name,
        japanese_name,
        voice_actors,
        status,
        character_eras (
          legacy_id,
          affiliation,
          rank,
          biography,
          series (
            slug
          ),
          pilot_assignments (
            mobile_suit_variants (
              mobile_suits (
                slug
              )
            )
          )
        )
      `,
      )
      .order("name");

    if (error) {
      throw new Error(`Unable to load characters: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return (data as unknown as CharacterRow[]).map((record) => {
      const eras: CharacterEra[] = (record.character_eras ?? [])
        .map((era) => ({
          id: era.legacy_id ?? crypto.randomUUID(),
          seriesId: firstRelation(era.series)?.slug ?? "unknown",
          faction: era.affiliation ?? "Unknown",
          rank: era.rank ?? undefined,
          biography: era.biography,
          pilotedUnitIds: getPilotedUnitIds(era.pilot_assignments),
        }))
        .sort((a, b) => a.id.localeCompare(b.id));

      return {
        id: record.slug,
        canonicalName: record.name,
        japaneseName: record.japanese_name ?? undefined,
        voiceActors: record.voice_actors ?? undefined,
        eras,
        status: record.status === "published" ? "published" : "draft",
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to load characters.");
  }
}

export async function getCharacterByIdFromDatabase(
  id: string,
): Promise<Character | undefined> {
  const characters = await getCharactersFromDatabase();

  return characters.find((character) => character.id === id);
}

export async function getCharactersBySeriesIdFromDatabase(
  seriesId: string,
): Promise<Character[]> {
  const characters = await getCharactersFromDatabase();

  return characters.filter((character) =>
    character.eras.some((era) => era.seriesId === seriesId),
  );
}
