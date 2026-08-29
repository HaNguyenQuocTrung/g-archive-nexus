begin;

create or replace view public.series_catalog_audit
with (security_invoker = true)
as
select
  audit.id,
  audit.slug,
  audit.title,
  audit.timeline_slug,
  audit.media_type,
  audit.release_year,
  audit.catalog_status,
  audit.missing_fields,
  greatest(
    0,
    100 - cardinality(audit.missing_fields) * 10
  ) as completeness_score
from (
  select
    series.id,
    series.slug,
    series.title,
    timelines.slug as timeline_slug,
    series.media_type,
    series.release_year,
    series.catalog_status,

    array_remove(
      array[
        case
          when nullif(trim(series.title), '') is null
          then 'title'
        end,

        case
          when nullif(trim(series.titles ->> 'ja'), '') is null
          then 'japanese_title'
        end,

        case
          when nullif(trim(series.synopsis), '') is null
          then 'synopsis'
        end,

        case
          when series.media_type is null
          then 'media_type'
        end,

        case
          when series.release_year is null
          then 'release_year'
        end,

        case
          when series.release_date is null
          then 'release_date'
        end,

        case
          when nullif(trim(series.director), '') is null
          then 'director'
        end,

        case
          when nullif(trim(series.official_url), '') is null
          then 'official_url'
        end,

        case
          when series.media_type in (
            'tv-series',
            'ova',
            'ona',
            'live-action-series'
          )
          and series.episode_count is null
          then 'episode_count'
        end,

        case
          when series.media_type in (
            'movie',
            'compilation-movie',
            'short-film',
            'live-action-movie',
            'vr-experience',
            'attraction-film'
          )
          and series.runtime_minutes is null
          then 'runtime_minutes'
        end,

        case
          when not exists (
            select 1
            from public.series_sources
            where series_sources.series_id = series.id
          )
          then 'reference_source'
        end
      ]::text[],
      null
    ) as missing_fields

  from public.series
  join public.timelines
    on timelines.id = series.timeline_id
) as audit;

create or replace view public.series_catalog_overview
with (security_invoker = true)
as
select
  media_type,
  count(*) as total_works,

  count(*) filter (
    where catalog_status = 'planned'
  ) as planned_works,

  count(*) filter (
    where catalog_status = 'in_progress'
  ) as in_progress_works,

  count(*) filter (
    where catalog_status = 'complete'
  ) as complete_works,

  count(*) filter (
    where catalog_status = 'verified'
  ) as verified_works,

  round(avg(completeness_score), 1) as average_completeness,

  count(*) filter (
    where cardinality(missing_fields) = 0
  ) as metadata_complete_works

from public.series_catalog_audit
group by media_type;

grant select
on public.series_catalog_audit
to anon, authenticated;

grant select
on public.series_catalog_overview
to anon, authenticated;

commit;