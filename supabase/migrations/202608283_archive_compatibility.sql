begin;

alter table public.series
  add column titles jsonb not null default '{}'::jsonb,
  add column in_universe_year text,
  add column director text;

alter table public.characters
  add column japanese_name text,
  add column voice_actors jsonb not null default '{}'::jsonb;

alter table public.character_eras
  add column legacy_id text unique;

alter table public.mobile_suits
  add column faction_ids text[] not null default '{}';

alter table public.mobile_suit_variants
  add column legacy_id text,
  add column crew integer,
  add column gallery jsonb not null default '[]'::jsonb;

alter table public.mobile_suit_variants
  add constraint variants_legacy_id_unique
  unique (mobile_suit_id, legacy_id);

alter table public.weapons
  add column legacy_id text,
  add column mounting_location text;

alter table public.weapons
  add constraint weapons_legacy_id_unique
  unique (variant_id, legacy_id);

alter table public.mobile_suit_systems
  add column legacy_id text;

alter table public.mobile_suit_systems
  add constraint systems_legacy_id_unique
  unique (variant_id, legacy_id);

alter table public.pilot_assignments
  add column legacy_id text unique,
  add column series_id uuid
    references public.series(id) on delete set null;

commit;