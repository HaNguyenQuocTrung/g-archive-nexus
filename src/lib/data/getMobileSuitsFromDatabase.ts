import "server-only";

import { getMobileSuitById, getMobileSuits } from "@/lib/data/getMobileSuits";
import { createClient } from "@/lib/supabase/server";
import type {
  Armament,
  MobileSuit,
  MobileSuitVariant,
  SpecialSystem,
} from "@/types";

interface SlugRelation {
  slug: string;
}

interface SeriesRelation {
  series: SlugRelation | SlugRelation[] | null;
}

interface WeaponRow {
  legacy_id: string | null;
  name: string;
  mounting_location: string | null;
  quantity: number | null;
  description: string;
}

interface SystemRow {
  legacy_id: string | null;
  name: string;
  description: string;
}

interface VariantRow {
  legacy_id: string | null;
  slug: string;
  form_name: string;
  description: string;
  is_default: boolean;
  height_meters: number | string | null;
  base_weight_tons: number | string | null;
  gross_weight_tons: number | string | null;
  generator_type: string | null;
  power_output_kw: number | string | null;
  armor_material: string | null;
  sensor_range_meters: number | string | null;
  crew: number | null;
  gallery: MobileSuitVariant["gallery"] | null;
  weapons: WeaponRow[] | null;
  mobile_suit_systems: SystemRow[] | null;
}

interface MobileSuitRow {
  slug: string;
  name: string;
  model_number: string;
  manufacturer: string | null;
  faction_ids: string[] | null;
  status: string;
  timelines: SlugRelation | SlugRelation[] | null;
  series_mobile_suits: SeriesRelation[] | null;
  mobile_suit_variants: VariantRow[] | null;
}

function firstRelation<T>(relation: T | T[] | null): T | undefined {
  return Array.isArray(relation) ? relation[0] : (relation ?? undefined);
}

function optionalNumber(value: number | string | null): number | undefined {
  if (value === null) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function mapWeapon(weapon: WeaponRow): Armament {
  return {
    id: weapon.legacy_id ?? weapon.name,
    name: weapon.name,
    mountingLocation: weapon.mounting_location ?? undefined,
    quantity: weapon.quantity ?? undefined,
    description: weapon.description,
  };
}

function mapSystem(system: SystemRow): SpecialSystem {
  return {
    id: system.legacy_id ?? system.name,
    name: system.name,
    description: system.description,
  };
}

function mapVariant(variant: VariantRow): MobileSuitVariant {
  return {
    id: variant.legacy_id ?? variant.slug,
    formName: variant.form_name,
    description: variant.description,
    specs: {
      heightMeters: optionalNumber(variant.height_meters),
      baseWeightTons: optionalNumber(variant.base_weight_tons),
      grossWeightTons: optionalNumber(variant.gross_weight_tons),
      generatorType: variant.generator_type ?? undefined,
      generatorOutputKw: optionalNumber(variant.power_output_kw),
      armorMaterial: variant.armor_material ?? undefined,
      sensorRangeMeters: optionalNumber(variant.sensor_range_meters),
      crew: variant.crew ?? undefined,
    },
    armaments: (variant.weapons ?? []).map(mapWeapon),
    specialSystems: (variant.mobile_suit_systems ?? []).map(mapSystem),
    gallery: variant.gallery ?? [],
  };
}

export async function getMobileSuitsFromDatabase(): Promise<MobileSuit[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return getMobileSuits();
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("mobile_suits")
      .select(
        `
        slug,
        name,
        model_number,
        manufacturer,
        faction_ids,
        status,
        timelines (
          slug
        ),
        series_mobile_suits (
          series (
            slug
          )
        ),
        mobile_suit_variants (
          legacy_id,
          slug,
          form_name,
          description,
          is_default,
          height_meters,
          base_weight_tons,
          gross_weight_tons,
          generator_type,
          power_output_kw,
          armor_material,
          sensor_range_meters,
          crew,
          gallery,
          weapons (
            legacy_id,
            name,
            mounting_location,
            quantity,
            description
          ),
          mobile_suit_systems (
            legacy_id,
            name,
            description
          )
        )
      `,
      )
      .order("model_number");

    if (error || !data?.length) {
      return getMobileSuits();
    }

    return (data as unknown as MobileSuitRow[]).map((record) => {
      const variants = (record.mobile_suit_variants ?? [])
        .sort((a, b) => {
          if (a.is_default !== b.is_default) {
            return a.is_default ? -1 : 1;
          }

          return a.form_name.localeCompare(b.form_name);
        })
        .map(mapVariant);

      const seriesIds = (record.series_mobile_suits ?? [])
        .map((relation) => firstRelation(relation.series)?.slug)
        .filter((slug): slug is string => Boolean(slug));

      return {
        id: record.slug,
        baseName: record.name,
        modelNumber: record.model_number,
        manufacturer: record.manufacturer ?? "Unknown",
        timelineId: firstRelation(record.timelines)?.slug ?? "unknown",
        seriesIds,
        factionIds: record.faction_ids ?? [],
        variants,
        status: record.status === "published" ? "published" : "draft",
      };
    });
  } catch {
    return getMobileSuits();
  }
}

export async function getMobileSuitByIdFromDatabase(
  id: string,
): Promise<MobileSuit | undefined> {
  const records = await getMobileSuitsFromDatabase();

  return records.find((record) => record.id === id) ?? getMobileSuitById(id);
}

export async function getMobileSuitsBySeriesIdFromDatabase(
  seriesId: string,
): Promise<MobileSuit[]> {
  const records = await getMobileSuitsFromDatabase();

  return records.filter((record) => record.seriesIds.includes(seriesId));
}

export async function getMobileSuitsByTimelineIdFromDatabase(
  timelineId: string,
): Promise<MobileSuit[]> {
  const records = await getMobileSuitsFromDatabase();

  return records.filter((record) => record.timelineId === timelineId);
}
