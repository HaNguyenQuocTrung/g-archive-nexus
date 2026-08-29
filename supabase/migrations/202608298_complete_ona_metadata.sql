begin;

with metadata (
  slug,
  japanese_title,
  director,
  release_date,
  end_date,
  studio
) as (
  values
    (
      'mobile-suit-gundam-seed-ce73-stargazer',
      '機動戦士ガンダムSEED C.E.73 -STARGAZER-',
      'Susumu Nishizawa',
      date '2006-07-14',
      date '2006-09-29',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-thunderbolt',
      '機動戦士ガンダム サンダーボルト',
      'Kou Matsuo',
      date '2015-12-25',
      date '2017-07-14',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-twilight-axis',
      '機動戦士ガンダム Twilight AXIS',
      'Se Jun Kim',
      date '2017-06-23',
      date '2017-09-01',
      'Sunrise'
    ),
    (
      'gundam-build-fighters-battlogue',
      'ガンダムビルドファイターズ バトローグ',
      'Masami Obari',
      date '2017-08-04',
      date '2017-12-08',
      'Sunrise'
    ),
    (
      'gundam-build-fighters-gms-counterattack',
      'ガンダムビルドファイターズ GMの逆襲',
      'Kenji Nagasaki',
      date '2017-08-25',
      date '2017-08-25',
      'Sunrise'
    ),
    (
      'gundam-build-divers-rerise',
      'ガンダムビルドダイバーズRe:RISE',
      'Shinya Watada',
      date '2019-10-10',
      date '2020-08-27',
      'Sunrise Beyond'
    ),
    (
      'sd-gundam-world-sangoku-soketsuden',
      'SDガンダムワールド 三国創傑伝',
      'Takahiro Ikezoe',
      date '2019-07-26',
      date '2021-03-25',
      'Sunrise'
    ),
    (
      'gundam-breaker-battlogue',
      'ガンダムブレイカー バトローグ',
      'Masami Obari',
      date '2021-10-19',
      date '2021-11-23',
      'Sunrise'
    ),
    (
      'sd-gundam-world-heroes',
      'SDガンダムワールド ヒーローズ',
      'Takahiro Ikezoe',
      date '2021-04-08',
      date '2021-09-16',
      'Sunrise'
    ),
    (
      'gundam-build-metaverse',
      'ガンダムビルドメタバース',
      'Masami Obari',
      date '2023-10-06',
      date '2023-10-20',
      'Sunrise Beyond'
    ),
    (
      'mobile-suit-gundam-requiem-for-vengeance',
      '機動戦士ガンダム 復讐のレクイエム',
      'Erasmus Brosdau',
      date '2024-10-17',
      date '2024-10-17',
      'SAFEHOUSE / Sunrise'
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
  end_date = metadata.end_date,
  studio = metadata.studio,
  catalog_status = 'complete',
  updated_at = now()
from metadata
where series.slug = metadata.slug;

commit;