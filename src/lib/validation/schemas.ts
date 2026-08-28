import { z } from "zod";

export const archiveStatusSchema = z.enum([
  "published",
  "draft",
  "restricted",
]);

export const archiveImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  type: z.enum([
    "poster",
    "artwork",
    "portrait",
    "line-art-front",
    "line-art-back",
    "cockpit",
    "weapon",
  ]),
});

export const timelineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().min(1),
  status: archiveStatusSchema,
  seriesIds: z.array(z.string()),
  coverImage: archiveImageSchema.optional(),
});

export const localizedTextSchema = z.object({
  en: z.string().min(1),
  ja: z.string().optional(),
  vi: z.string().optional(),
});

export const seriesSchema = z.object({
  id: z.string().min(1),
  titles: localizedTextSchema,
  timelineId: z.string().min(1),
  mediaType: z.enum([
    "tv-series",
    "movie",
    "ova",
    "ona",
    "manga",
    "novel",
    "game",
  ]),
  inUniverseYear: z.string().min(1),
  releaseYear: z.number().int(),
  director: z.string().optional(),
  synopsis: z.string().min(1),
  characterIds: z.array(z.string()),
  mobileSuitIds: z.array(z.string()),
  poster: archiveImageSchema.optional(),
  status: archiveStatusSchema,
});

export const characterEraSchema = z.object({
  id: z.string().min(1),
  seriesId: z.string().min(1),
  aliasName: z.string().optional(),
  faction: z.string().min(1),
  rank: z.string().optional(),
  biography: z.string().min(1),
  pilotedUnitIds: z.array(z.string()),
  portrait: archiveImageSchema.optional(),
});

export const characterSchema = z.object({
  id: z.string().min(1),
  canonicalName: z.string().min(1),
  japaneseName: z.string().optional(),
  voiceActors: z
    .object({
      japanese: z.string().optional(),
      english: z.string().optional(),
    })
    .optional(),
  eras: z.array(characterEraSchema).min(1),
  status: archiveStatusSchema,
});

export const technicalSpecsSchema = z.object({
  heightMeters: z.number().positive().optional(),
  baseWeightTons: z.number().positive().optional(),
  grossWeightTons: z.number().positive().optional(),
  generatorType: z.string().optional(),
  generatorOutputKw: z.number().positive().optional(),
  armorMaterial: z.string().optional(),
  sensorRangeMeters: z.number().positive().optional(),
  crew: z.number().int().positive().optional(),
});

export const armamentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  mountingLocation: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  description: z.string().min(1),
});

export const specialSystemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
});

export const mobileSuitVariantSchema = z.object({
  id: z.string().min(1),
  formName: z.string().min(1),
  description: z.string().min(1),
  specs: technicalSpecsSchema,
  armaments: z.array(armamentSchema),
  specialSystems: z.array(specialSystemSchema),
  gallery: z.array(archiveImageSchema),
});

export const mobileSuitSchema = z.object({
  id: z.string().min(1),
  baseName: z.string().min(1),
  modelNumber: z.string().min(1),
  manufacturer: z.string().min(1),
  timelineId: z.string().min(1),
  seriesIds: z.array(z.string()).min(1),
  factionIds: z.array(z.string()),
  variants: z.array(mobileSuitVariantSchema).min(1),
  status: archiveStatusSchema,
});

export const pilotLogSchema = z.object({
  id: z.string().min(1),
  characterId: z.string().min(1),
  characterEraId: z.string().min(1),
  mobileSuitId: z.string().min(1),
  variantId: z.string().min(1),
  seriesId: z.string().min(1),
  notes: z.string().optional(),
});