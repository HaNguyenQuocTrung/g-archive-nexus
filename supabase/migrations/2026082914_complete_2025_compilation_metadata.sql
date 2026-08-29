begin;

with metadata (
  slug,
  japanese_title,
  director,
  runtime_minutes,
  studio
) as (
  values
    (
      'mobile-suit-gundam-gquuuuuux-beginning',
      '機動戦士Gundam GQuuuuuuX -Beginning-',
      'Kazuya Tsurumaki',
      81,
      'Studio Khara / Sunrise'
    ),
    (
      'mobile-suit-gundam-iron-blooded-orphans-urdr-hunt-path-of-the-little-challenger',
      '機動戦士ガンダム 鉄血のオルフェンズ ウルズハント -小さな挑戦者の軌跡-',
      'Tatsuyuki Nagai',
      83,
      'Sunrise Beyond / Bandai Namco Filmworks'
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
  runtime_minutes = metadata.runtime_minutes,
  studio = metadata.studio,
  catalog_status = 'complete',
  updated_at = now()
from metadata
where series.slug = metadata.slug;

commit;