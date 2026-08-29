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
      'mobile-suit-gundam-thunderbolt-december-sky',
      '機動戦士ガンダム サンダーボルト DECEMBER SKY',
      'Kou Matsuo',
      69,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-thunderbolt-bandit-flower',
      '機動戦士ガンダム サンダーボルト BANDIT FLOWER',
      'Kou Matsuo',
      90,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-twilight-axis-red-trace',
      '機動戦士ガンダム Twilight AXIS 赤き残影',
      'Se Jun Kim',
      26,
      'Sunrise'
    ),
    (
      'gundam-reconguista-in-g-i-go-core-fighter',
      '劇場版 Gのレコンギスタ I 行け！コア・ファイター',
      'Yoshiyuki Tomino',
      95,
      'Sunrise'
    ),
    (
      'gundam-reconguista-in-g-ii-bellris-fierce-charge',
      '劇場版 Gのレコンギスタ II ベルリ 撃進',
      'Yoshiyuki Tomino',
      94,
      'Sunrise'
    ),
    (
      'gundam-reconguista-in-g-iii-legacy-from-space',
      '劇場版 Gのレコンギスタ III 宇宙からの遺産',
      'Yoshiyuki Tomino',
      104,
      'Sunrise'
    ),
    (
      'gundam-reconguista-in-g-iv-love-that-cries-out-in-battle',
      '劇場版 Gのレコンギスタ IV 激闘に叫ぶ愛',
      'Yoshiyuki Tomino',
      102,
      'Sunrise'
    ),
    (
      'gundam-reconguista-in-g-v-beyond-the-peril-of-death',
      '劇場版 Gのレコンギスタ V 死線を越えて',
      'Yoshiyuki Tomino',
      96,
      'Sunrise'
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