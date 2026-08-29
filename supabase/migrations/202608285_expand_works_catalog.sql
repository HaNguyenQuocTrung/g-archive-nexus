begin;

create type public.catalog_status as enum (
  'planned',
  'in_progress',
  'complete',
  'verified'
);

alter table public.series
  rename column format to media_type;

alter table public.series
  add column release_date date,
  add column end_date date,
  add column runtime_minutes integer,
  add column studio text,
  add column producer text,
  add column official_url text,
  add column catalog_status public.catalog_status
    not null default 'planned',
  add column catalog_notes text;

alter table public.series
  add constraint series_media_type_check
  check (
    media_type in (
      'tv-series',
      'movie',
      'ova',
      'ona',
      'special',
      'compilation-movie',
      'short-film',
      'promotional-animation'
    )
  );

alter table public.series
  add constraint series_episode_count_check
  check (
    episode_count is null or episode_count >= 0
  );

alter table public.series
  add constraint series_runtime_check
  check (
    runtime_minutes is null or runtime_minutes > 0
  );

create table public.work_relations (
  source_series_id uuid not null
    references public.series(id) on delete cascade,
  target_series_id uuid not null
    references public.series(id) on delete cascade,
  relation_type text not null
    check (
      relation_type in (
        'prequel',
        'sequel',
        'side-story',
        'spin-off',
        'compilation',
        'remake',
        'alternate-version'
      )
    ),
  notes text,
  created_at timestamptz not null default now(),

  primary key (
    source_series_id,
    target_series_id,
    relation_type
  ),

  check (source_series_id <> target_series_id)
);

create table public.reference_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null unique,
  publisher text,
  source_type text not null default 'official'
    check (
      source_type in (
        'official',
        'book',
        'encyclopedia',
        'database',
        'secondary'
      )
    ),
  accessed_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table public.series_sources (
  series_id uuid not null
    references public.series(id) on delete cascade,
  source_id uuid not null
    references public.reference_sources(id) on delete cascade,
  is_primary boolean not null default false,
  notes text,

  primary key (series_id, source_id)
);

create index series_media_type_idx
  on public.series(media_type);

create index series_catalog_status_idx
  on public.series(catalog_status);

alter table public.work_relations enable row level security;
alter table public.reference_sources enable row level security;
alter table public.series_sources enable row level security;

create policy "Work relations are publicly readable"
on public.work_relations
for select
to anon, authenticated
using (true);

create policy "Reference sources are publicly readable"
on public.reference_sources
for select
to anon, authenticated
using (true);

create policy "Series sources are publicly readable"
on public.series_sources
for select
to anon, authenticated
using (true);

create policy "Admins manage work relations"
on public.work_relations
for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage reference sources"
on public.reference_sources
for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

create policy "Admins manage series sources"
on public.series_sources
for all
to authenticated
using (public.is_archive_admin())
with check (public.is_archive_admin());

grant select on table
  public.work_relations,
  public.reference_sources,
  public.series_sources
to anon, authenticated;

grant insert, update, delete on table
  public.work_relations,
  public.reference_sources,
  public.series_sources
to authenticated;

grant all privileges on table
  public.work_relations,
  public.reference_sources,
  public.series_sources
to service_role;

commit;