import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!projectUrl || !secretKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
}

const supabase = createClient(projectUrl, secretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const dataRoot = path.join(process.cwd(), "src", "data");

async function readJsonDirectory(directoryName) {
  const directory = path.join(dataRoot, directoryName);
  const filenames = (await readdir(directory))
    .filter((filename) => filename.endsWith(".json"))
    .sort();

  return Promise.all(
    filenames.map(async (filename) => {
      const filePath = path.join(directory, filename);
      const content = await readFile(filePath, "utf8");
      return JSON.parse(content);
    }),
  );
}

function assertResult(result, context) {
  if (result.error) {
    throw new Error(`${context}: ${result.error.message}`);
  }

  return result.data;
}

async function upsertOne(table, record, onConflict) {
  const result = await supabase
    .from(table)
    .upsert(record, { onConflict })
    .select("id")
    .single();

  return assertResult(result, `Unable to upsert ${table}`).id;
}

async function runImport() {
  console.log("Loading archive JSON files...");

  const [timelines, series, characters, mobileSuits, pilotLogs] =
    await Promise.all([
      readJsonDirectory("timelines"),
      readJsonDirectory("series"),
      readJsonDirectory("characters"),
      readJsonDirectory("mobile-suits"),
      readJsonDirectory("pilot-logs"),
    ]);

  const timelineIds = new Map();
  const seriesIds = new Map();
  const characterIds = new Map();
  const characterEraIds = new Map();
  const mobileSuitIds = new Map();
  const variantIds = new Map();

  console.log(`Importing ${timelines.length} timelines...`);

  for (const timeline of timelines) {
    const id = await upsertOne(
      "timelines",
      {
        slug: timeline.id,
        code: timeline.code,
        name: timeline.name,
        description: timeline.description ?? "",
        status: timeline.status ?? "draft",
      },
      "slug",
    );

    timelineIds.set(timeline.id, id);
  }

  console.log(`Importing ${series.length} series...`);

  for (const item of series) {
    const timelineId = timelineIds.get(item.timelineId);

    if (!timelineId) {
      throw new Error(`Unknown timeline: ${item.timelineId}`);
    }

    const id = await upsertOne(
      "series",
      {
        timeline_id: timelineId,
        slug: item.id,
        title: item.titles?.en ?? item.id,
        alternative_title: item.titles?.ja ?? item.titles?.vi ?? null,
        titles: item.titles ?? {},
        synopsis: item.synopsis ?? "",
        format: item.mediaType ?? null,
        in_universe_year: item.inUniverseYear ?? null,
        release_year: item.releaseYear ?? null,
        director: item.director ?? null,
        status: item.status ?? "draft",
      },
      "slug",
    );

    seriesIds.set(item.id, id);
  }

  console.log(`Importing ${characters.length} characters...`);

  for (const character of characters) {
    const characterId = await upsertOne(
      "characters",
      {
        slug: character.id,
        name: character.canonicalName,
        japanese_name: character.japaneseName ?? null,
        voice_actors: character.voiceActors ?? {},
        description: character.description ?? "",
        aliases: character.aliases ?? [],
        image_url: character.imageUrl ?? null,
        status: character.status ?? "draft",
      },
      "slug",
    );

    characterIds.set(character.id, characterId);

    for (const era of character.eras ?? []) {
      const eraId = await upsertOne(
        "character_eras",
        {
          legacy_id: era.id,
          character_id: characterId,
          series_id: seriesIds.get(era.seriesId) ?? null,
          era_name:
            series.find((item) => item.id === era.seriesId)?.inUniverseYear ??
            era.id,
          affiliation: era.faction ?? null,
          rank: era.rank ?? null,
          biography: era.biography ?? "",
        },
        "legacy_id",
      );

      characterEraIds.set(era.id, eraId);
    }
  }

  console.log(`Importing ${mobileSuits.length} Mobile Suits...`);

  for (const mobileSuit of mobileSuits) {
    const timelineId = timelineIds.get(mobileSuit.timelineId);

    if (!timelineId) {
      throw new Error(`Unknown timeline for Mobile Suit ${mobileSuit.id}`);
    }

    const mobileSuitId = await upsertOne(
      "mobile_suits",
      {
        timeline_id: timelineId,
        primary_series_id: seriesIds.get(mobileSuit.seriesIds?.[0]) ?? null,
        slug: mobileSuit.id,
        model_number: mobileSuit.modelNumber,
        name: mobileSuit.baseName,
        aliases: mobileSuit.aliases ?? [],
        classification: mobileSuit.classification ?? null,
        manufacturer: mobileSuit.manufacturer ?? null,
        operator_name: mobileSuit.operator ?? null,
        faction_ids: mobileSuit.factionIds ?? [],
        description: mobileSuit.description ?? "",
        image_url: mobileSuit.imageUrl ?? null,
        status: mobileSuit.status ?? "draft",
      },
      "slug",
    );

    mobileSuitIds.set(mobileSuit.id, mobileSuitId);

    for (const variant of mobileSuit.variants ?? []) {
      const specs = variant.specs ?? {};

      const variantId = await upsertOne(
        "mobile_suit_variants",
        {
          mobile_suit_id: mobileSuitId,
          legacy_id: variant.id,
          slug: variant.id,
          form_name: variant.formName,
          description: variant.description ?? "",
          is_default: variant.id === "standard",
          height_meters: specs.heightMeters ?? null,
          base_weight_tons: specs.baseWeightTons ?? null,
          gross_weight_tons: specs.grossWeightTons ?? null,
          generator_type: specs.generatorType ?? null,
          power_output_kw: specs.powerOutputKw ?? null,
          sensor_range_meters: specs.sensorRangeMeters ?? null,
          armor_material: specs.armorMaterial ?? null,
          crew: specs.crew ?? null,
          gallery: variant.gallery ?? [],
          image_url: variant.imageUrl ?? null,
        },
        "mobile_suit_id,legacy_id",
      );

      variantIds.set(`${mobileSuit.id}:${variant.id}`, variantId);

      const deleteWeapons = await supabase
        .from("weapons")
        .delete()
        .eq("variant_id", variantId);

      assertResult(
        deleteWeapons,
        `Unable to synchronize weapons for ${variant.id}`,
      );

      if (variant.armaments?.length) {
        const weaponResult = await supabase.from("weapons").insert(
          variant.armaments.map((weapon) => ({
            variant_id: variantId,
            legacy_id: weapon.id,
            name: weapon.name,
            weapon_type: weapon.weaponType ?? null,
            mounting_location: weapon.mountingLocation ?? null,
            quantity: weapon.quantity ?? 1,
            description: weapon.description ?? "",
          })),
        );

        assertResult(
          weaponResult,
          `Unable to import weapons for ${variant.id}`,
        );
      }

      const deleteSystems = await supabase
        .from("mobile_suit_systems")
        .delete()
        .eq("variant_id", variantId);

      assertResult(
        deleteSystems,
        `Unable to synchronize systems for ${variant.id}`,
      );

      if (variant.specialSystems?.length) {
        const systemResult = await supabase.from("mobile_suit_systems").insert(
          variant.specialSystems.map((system) => ({
            variant_id: variantId,
            legacy_id: system.id,
            name: system.name,
            description: system.description ?? "",
          })),
        );

        assertResult(
          systemResult,
          `Unable to import systems for ${variant.id}`,
        );
      }
    }
  }

  console.log("Importing series relationships...");

  for (const item of series) {
    const seriesId = seriesIds.get(item.id);

    const characterRelations = (item.characterIds ?? [])
      .map((characterId) => characterIds.get(characterId))
      .filter(Boolean)
      .map((characterId) => ({
        series_id: seriesId,
        character_id: characterId,
      }));

    if (characterRelations.length) {
      const result = await supabase
        .from("series_characters")
        .upsert(characterRelations, {
          onConflict: "series_id,character_id",
        });

      assertResult(result, `Unable to link characters to ${item.id}`);
    }

    const mobileSuitRelations = (item.mobileSuitIds ?? [])
      .map((mobileSuitId) => mobileSuitIds.get(mobileSuitId))
      .filter(Boolean)
      .map((mobileSuitId) => ({
        series_id: seriesId,
        mobile_suit_id: mobileSuitId,
      }));

    if (mobileSuitRelations.length) {
      const result = await supabase
        .from("series_mobile_suits")
        .upsert(mobileSuitRelations, {
          onConflict: "series_id,mobile_suit_id",
        });

      assertResult(result, `Unable to link Mobile Suits to ${item.id}`);
    }
  }

  console.log(`Importing ${pilotLogs.length} pilot logs...`);

  for (const pilotLog of pilotLogs) {
    const characterEraId = characterEraIds.get(pilotLog.characterEraId);

    const variantId = variantIds.get(
      `${pilotLog.mobileSuitId}:${pilotLog.variantId}`,
    );

    if (!characterEraId || !variantId) {
      throw new Error(`Invalid pilot log relationship: ${pilotLog.id}`);
    }

    await upsertOne(
      "pilot_assignments",
      {
        legacy_id: pilotLog.id,
        character_era_id: characterEraId,
        variant_id: variantId,
        series_id: seriesIds.get(pilotLog.seriesId) ?? null,
        notes: pilotLog.notes ?? null,
      },
      "legacy_id",
    );
  }

  console.log("");
  console.log("Archive import completed successfully.");
  console.log(`Timelines: ${timelines.length}`);
  console.log(`Series: ${series.length}`);
  console.log(`Characters: ${characters.length}`);
  console.log(`Mobile Suits: ${mobileSuits.length}`);
  console.log(`Pilot logs: ${pilotLogs.length}`);
}

runImport().catch((error) => {
  console.error("");
  console.error("Archive import failed.");
  console.error(error);
  process.exitCode = 1;
});
