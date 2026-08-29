begin;

with metadata (
  slug,
  japanese_title,
  director,
  release_date,
  runtime_minutes,
  studio
) as (
  values
    (
      'gundam-build-fighters-try-island-wars',
      'ガンダムビルドファイターズトライ アイランド・ウォーズ',
      'Shinya Watada',
      '2016-08-21'::date,
      36,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-the-witch-from-mercury-prologue',
      '機動戦士ガンダム 水星の魔女 PROLOGUE',
      'Hiroshi Kobayashi',
      '2022-07-14'::date,
      24,
      'Bandai Namco Filmworks'
    )
)

update public.series
set
  titles = jsonb_set(
    coalesce(series.titles, '{}'::jsonb),
    '{ja}',
    to_jsonb(metadata.japanese_title),
    true
  ),
  director = metadata.director,
  release_date = metadata.release_date,
  runtime_minutes = metadata.runtime_minutes,
  studio = metadata.studio,
  catalog_status = 'complete',
  updated_at = now()
from metadata
where series.slug = metadata.slug;

commit;