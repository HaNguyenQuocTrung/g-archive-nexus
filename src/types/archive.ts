export type ArchiveStatus = "published" | "draft" | "restricted";

export type MediaType =
  | "tv-series"
  | "movie"
  | "ova"
  | "ona"
  | "special"
  | "compilation-movie"
  | "short-film"
  | "promotional-animation"
  | "live-action-movie"
  | "live-action-series"
  | "vr-experience"
  | "motion-comic"
  | "music-video"
  | "attraction-film"
  | "manga"
  | "novel"
  | "game";

export type CatalogStatus =
  | "planned"
  | "in_progress"
  | "complete"
  | "verified";

export interface LocalizedText {
  en: string;
  ja?: string;
  vi?: string;
}

export interface Series {
  id: string;
  titles: LocalizedText;
  timelineId: string;
  mediaType: MediaType;
  inUniverseYear: string;
  releaseYear: number;
  releaseDate?: string;
  endYear?: number;
  episodeCount?: number;
  runtimeMinutes?: number;
  director?: string;
  synopsis: string;
  characterIds: string[];
  mobileSuitIds: string[];
  poster?: ArchiveImage;
  status: ArchiveStatus;
  catalogStatus: CatalogStatus;
  officialUrl?: string;
}

export interface ArchiveImage {
  src: string;
  alt: string;
  type:
    | "poster"
    | "artwork"
    | "portrait"
    | "line-art-front"
    | "line-art-back"
    | "cockpit"
    | "weapon";
}

export interface Timeline {
  id: string;
  name: string;
  code: string;
  description: string;
  status: ArchiveStatus;
  seriesIds: string[];
  coverImage?: ArchiveImage;
}

export interface CharacterEra {
  id: string;
  seriesId: string;
  aliasName?: string;
  faction: string;
  rank?: string;
  biography: string;
  pilotedUnitIds: string[];
  portrait?: ArchiveImage;
}

export interface Character {
  id: string;
  canonicalName: string;
  japaneseName?: string;
  voiceActors?: {
    japanese?: string;
    english?: string;
  };
  eras: CharacterEra[];
  status: ArchiveStatus;
}

export interface TechnicalSpecs {
  heightMeters?: number;
  baseWeightTons?: number;
  grossWeightTons?: number;
  generatorType?: string;
  generatorOutputKw?: number;
  armorMaterial?: string;
  sensorRangeMeters?: number;
  crew?: number;
}

export interface Armament {
  id: string;
  name: string;
  mountingLocation?: string;
  quantity?: number;
  description: string;
}

export interface SpecialSystem {
  id: string;
  name: string;
  description: string;
}

export interface MobileSuitVariant {
  id: string;
  formName: string;
  description: string;
  specs: TechnicalSpecs;
  armaments: Armament[];
  specialSystems: SpecialSystem[];
  gallery: ArchiveImage[];
}

export interface MobileSuit {
  id: string;
  baseName: string;
  modelNumber: string;
  manufacturer: string;
  timelineId: string;
  seriesIds: string[];
  factionIds: string[];
  variants: MobileSuitVariant[];
  status: ArchiveStatus;
}

export interface PilotLog {
  id: string;
  characterId: string;
  characterEraId: string;
  mobileSuitId: string;
  variantId: string;
  seriesId: string;
  notes?: string;
}
