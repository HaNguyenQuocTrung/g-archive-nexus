import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import type { PilotLog } from "@/types";

interface SlugRelation {
  slug: string;
}

interface CharacterRelation {
  slug: string;
}

interface CharacterEraRelation {
  legacy_id: string | null;
  characters: CharacterRelation | CharacterRelation[] | null;
}

interface MobileSuitRelation {
  slug: string;
}

interface VariantRelation {
  legacy_id: string | null;
  slug: string;
  mobile_suits: MobileSuitRelation | MobileSuitRelation[] | null;
}

interface PilotAssignmentRow {
  legacy_id: string | null;
  notes: string | null;
  character_eras: CharacterEraRelation | CharacterEraRelation[] | null;
  mobile_suit_variants: VariantRelation | VariantRelation[] | null;
  series: SlugRelation | SlugRelation[] | null;
}

function firstRelation<T>(relation: T | T[] | null): T | undefined {
  return Array.isArray(relation) ? relation[0] : (relation ?? undefined);
}

export async function getPilotLogsFromDatabase(): Promise<PilotLog[]> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("pilot_assignments")
      .select(
        `
        legacy_id,
        notes,
        character_eras (
          legacy_id,
          characters (
            slug
          )
        ),
        mobile_suit_variants (
          legacy_id,
          slug,
          mobile_suits (
            slug
          )
        ),
        series (
          slug
        )
      `,
      )
      .order("created_at");

    if (error) {
      throw new Error(`Unable to load pilot logs: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return (data as unknown as PilotAssignmentRow[]).flatMap((record) => {
      const characterEra = firstRelation(record.character_eras);

      const character = firstRelation(characterEra?.characters ?? null);

      const variant = firstRelation(record.mobile_suit_variants);

      const mobileSuit = firstRelation(variant?.mobile_suits ?? null);

      const series = firstRelation(record.series);

      if (
        !characterEra?.legacy_id ||
        !character?.slug ||
        !variant ||
        !mobileSuit?.slug ||
        !series?.slug
      ) {
        return [];
      }

      return [
        {
          id:
            record.legacy_id ??
            `${character.slug}-${mobileSuit.slug}-${variant.slug}`,
          characterId: character.slug,
          characterEraId: characterEra.legacy_id,
          mobileSuitId: mobileSuit.slug,
          variantId: variant.legacy_id ?? variant.slug,
          seriesId: series.slug,
          notes: record.notes ?? undefined,
        },
      ];
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to load pilot logs.");
  }
}

export async function getPilotLogsByCharacterIdFromDatabase(
  characterId: string,
): Promise<PilotLog[]> {
  const records = await getPilotLogsFromDatabase();

  const matches = records.filter(
    (record) => record.characterId === characterId,
  );

  return matches;
}

export async function getPilotLogsByMobileSuitIdFromDatabase(
  mobileSuitId: string,
): Promise<PilotLog[]> {
  const records = await getPilotLogsFromDatabase();

  const matches = records.filter(
    (record) => record.mobileSuitId === mobileSuitId,
  );

  return matches;
}

export async function getPilotLogsByVariantIdFromDatabase(
  mobileSuitId: string,
  variantId: string,
): Promise<PilotLog[]> {
  const records = await getPilotLogsByMobileSuitIdFromDatabase(mobileSuitId);

  return records.filter((record) => record.variantId === variantId);
}
