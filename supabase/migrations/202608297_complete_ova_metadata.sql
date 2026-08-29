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
      'mobile-suit-gundam-0080-war-in-the-pocket',
      '機動戦士ガンダム0080 ポケットの中の戦争',
      'Fumihiko Takayama',
      date '1989-03-25',
      date '1989-08-25',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-0083-stardust-memory',
      '機動戦士ガンダム0083 STARDUST MEMORY',
      'Mitsuko Kase / Takashi Imanishi',
      date '1991-05-23',
      date '1992-09-24',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-the-08th-ms-team',
      '機動戦士ガンダム 第08MS小隊',
      'Takeyuki Kanda / Umanosuke Iida',
      date '1996-01-25',
      date '1999-07-25',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-wing-endless-waltz',
      '新機動戦記ガンダムW Endless Waltz',
      'Yasunao Aoki',
      date '1997-01-25',
      date '1997-07-25',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-ms-igloo-the-hidden-one-year-war',
      '機動戦士ガンダム MS IGLOO -1年戦争秘録-',
      'Takashi Imanishi',
      date '2004-07-19',
      date '2004-11-03',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-ms-igloo-apocalypse-0079',
      '機動戦士ガンダム MS IGLOO -黙示録0079-',
      'Takashi Imanishi',
      date '2006-04-26',
      date '2006-08-25',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-ms-igloo-2-gravity-front',
      '機動戦士ガンダム MSイグルー2 重力戦線',
      'Takashi Imanishi',
      date '2008-10-24',
      date '2009-04-24',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-unicorn',
      '機動戦士ガンダムUC',
      'Kazuhiro Furuhashi',
      date '2010-02-20',
      date '2014-05-17',
      'Sunrise'
    ),
    (
      'model-suit-gunpla-builders-beginning-g',
      '模型戦士ガンプラビルダーズ ビギニングG',
      'Kou Matsuo',
      date '2010-08-15',
      date '2010-12-19',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-age-memory-of-eden',
      '機動戦士ガンダムAGE MEMORY OF EDEN',
      'Shinya Watada',
      date '2013-07-26',
      date '2013-07-26',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-the-origin',
      '機動戦士ガンダム THE ORIGIN',
      'Takashi Imanishi',
      date '2015-02-28',
      date '2018-05-05',
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
  release_date = metadata.release_date,
  end_date = metadata.end_date,
  studio = metadata.studio,
  catalog_status = 'complete',
  updated_at = now()
from metadata
where series.slug = metadata.slug;

commit;