begin;

create type public.content_status as enum (
  'draft',
  'published',
  'archived'
);

create table public.timelines (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code text not null unique,
  name text not null,
  description text not null default '',
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.series (
  id uuid primary key default gen_random_uuid(),
  timeline_id uuid not null
    references public.timelines(id) on delete restrict,
  slug text not null unique,
  title text not null,
  alternative_title text,
  synopsis text not null default '',
  format text,
  release_year integer,
  end_year integer,
  episode_count integer,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  aliases text[] not null default '{}',
  description text not null default '',
  image_url text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.character_eras (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null
    references public.characters(id) on delete cascade,
  series_id uuid
    references public.series(id) on delete set null,
  era_name text not null,
  affiliation text,
  rank text,
  biography text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (character_id, era_name)
);

create table public.mobile_suits (
  id uuid primary key default gen_random_uuid(),
  timeline_id uuid not null
    references public.timelines(id) on delete restrict,
  primary_series_id uuid
    references public.series(id) on delete set null,
  slug text not null unique,
  model_number text not null,
  name text not null,
  aliases text[] not null default '{}',
  classification text,
  manufacturer text,
  operator_name text,
  description text not null default '',
  image_url text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mobile_suit_variants (
  id uuid primary key default gen_random_uuid(),
  mobile_suit_id uuid not null
    references public.mobile_suits(id) on delete cascade,
  slug text not null,
  form_name text not null,
  description text not null default '',
  is_default boolean not null default false,
  height_meters numeric(8,2),
  base_weight_tons numeric(8,2),
  gross_weight_tons numeric(8,2),
  generator_type text,
  power_output_kw numeric(12,2),
  sensor_range_meters numeric(12,2),
  armor_material text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (mobile_suit_id, slug)
);

create table public.weapons (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null
    references public.mobile_suit_variants(id) on delete cascade,
  name text not null,
  weapon_type text,
  quantity integer not null default 1 check (quantity > 0),
  description text not null default '',
  created_at timestamptz not null default now()
);

create table public.mobile_suit_systems (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null
    references public.mobile_suit_variants(id) on delete cascade,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table public.pilot_assignments (
  id uuid primary key default gen_random_uuid(),
  character_era_id uuid not null
    references public.character_eras(id) on delete cascade,
  variant_id uuid not null
    references public.mobile_suit_variants(id) on delete cascade,
  notes text,
  created_at timestamptz not null default now(),

  unique (character_era_id, variant_id)
);

create table public.series_mobile_suits (
  series_id uuid not null
    references public.series(id) on delete cascade,
  mobile_suit_id uuid not null
    references public.mobile_suits(id) on delete cascade,

  primary key (series_id, mobile_suit_id)
);

create table public.series_characters (
  series_id uuid not null
    references public.series(id) on delete cascade,
  character_id uuid not null
    references public.characters(id) on delete cascade,

  primary key (series_id, character_id)
);

create index series_timeline_id_idx
  on public.series(timeline_id);

create index character_eras_character_id_idx
  on public.character_eras(character_id);

create index mobile_suits_timeline_id_idx
  on public.mobile_suits(timeline_id);

create index mobile_suits_primary_series_id_idx
  on public.mobile_suits(primary_series_id);

create index variants_mobile_suit_id_idx
  on public.mobile_suit_variants(mobile_suit_id);

create index weapons_variant_id_idx
  on public.weapons(variant_id);

create index systems_variant_id_idx
  on public.mobile_suit_systems(variant_id);

create or replace function public.is_archive_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'moderator')
  );
$$;

create trigger timelines_set_updated_at
before update on public.timelines
for each row execute function public.set_updated_at();

create trigger series_set_updated_at
before update on public.series
for each row execute function public.set_updated_at();

create trigger characters_set_updated_at
before update on public.characters
for each row execute function public.set_updated_at();

create trigger character_eras_set_updated_at
before update on public.character_eras
for each row execute function public.set_updated_at();

create trigger mobile_suits_set_updated_at
before update on public.mobile_suits
for each row execute function public.set_updated_at();

create trigger variants_set_updated_at
before update on public.mobile_suit_variants
for each row execute function public.set_updated_at();

alter table public.timelines enable row level security;
alter table public.series enable row level security;
alter table public.characters enable row level security;
alter table public.character_eras enable row level security;
alter table public.mobile_suits enable row level security;
alter table public.mobile_suit_variants enable row level security;
alter table public.weapons enable row level security;
alter table public.mobile_suit_systems enable row level security;
alter table public.pilot_assignments enable row level security;
alter table public.series_mobile_suits enable row level security;
alter table public.series_characters enable row level security;

create policy "Published timelines are readable"
on public.timelines for select
to anon, authenticated
using (status = 'published' or public.is_archive_admin());

create policy "Published series are readable"
on public.series for select
to anon, authenticated
using (status = 'published' or public.is_archive_admin());

create policy "Published characters are readable"
on public.characters for select
to anon, authenticated
using (status = 'published' or public.is_archive_admin());

create policy "Published Mobile Suits are readable"
on public.mobile_suits for select
to anon, authenticated
using (status = 'published' or public.is_archive_admin());

create policy "Character eras are readable"
on public.character_eras for select
to anon, authenticated
using (
  public.is_archive_admin()
  or exists (
    select 1 from public.characters
    where characters.id = character_eras.character_id
      and characters.status = 'published'
  )
);

create policy "Published variants are readable"
on public.mobile_suit_variants for select
to anon, authenticated
using (
  public.is_archive_admin()
  or exists (
    select 1 from public.mobile_suits
    where mobile_suits.id = mobile_suit_variants.mobile_suit_id
      and mobile_suits.status = 'published'
  )
);

create policy "Published weapons are readable"
on public.weapons for select
to anon, authenticated
using (
  public.is_archive_admin()
  or exists (
    select 1
    from public.mobile_suit_variants
    join public.mobile_suits
      on mobile_suits.id = mobile_suit_variants.mobile_suit_id
    where mobile_suit_variants.id = weapons.variant_id
      and mobile_suits.status = 'published'
  )
);

create policy "Published systems are readable"
on public.mobile_suit_systems for select
to anon, authenticated
using (
  public.is_archive_admin()
  or exists (
    select 1
    from public.mobile_suit_variants
    join public.mobile_suits
      on mobile_suits.id = mobile_suit_variants.mobile_suit_id
    where mobile_suit_variants.id = mobile_suit_systems.variant_id
      and mobile_suits.status = 'published'
  )
);

create policy "Archive relations are readable"
on public.pilot_assignments for select
to anon, authenticated
using (true);

create policy "Series Mobile Suit relations are readable"
on public.series_mobile_suits for select
to anon, authenticated
using (true);

create policy "Series character relations are readable"
on public.series_characters for select
to anon, authenticated
using (true);

create policy "Admins manage timelines"
on public.timelines for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage series"
on public.series for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage characters"
on public.characters for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage character eras"
on public.character_eras for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage Mobile Suits"
on public.mobile_suits for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage variants"
on public.mobile_suit_variants for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage weapons"
on public.weapons for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage systems"
on public.mobile_suit_systems for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage pilot assignments"
on public.pilot_assignments for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage series Mobile Suits"
on public.series_mobile_suits for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage series characters"
on public.series_characters for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

commit;