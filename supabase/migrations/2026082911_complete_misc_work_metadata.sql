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
      'gundam-mission-to-the-rise',
      'ガンダム ミッション・トゥ・ザ・ライズ',
      'Katsuhiro Otomo',
      '1998-08-01'::date,
      5,
      'Sunrise'
    ),
    (
      'g-saviour',
      'G-SAVIOUR',
      'Graeme Campbell',
      '1999-06-18'::date,
      93,
      'Sunrise / Polestar Entertainment'
    ),
    (
      'gundam-the-ride-a-baoa-qu',
      'ガンダム・ザ・ライド A BAOA QU',
      'Uncredited',
      '2000-07-20'::date,
      5,
      'Sunrise'
    ),
    (
      'gundam-neo-experience-0087-green-divers',
      'ガンダム新体験―0087―グリーンダイバーズ',
      'Tomomi Mochizuki',
      '2001-08-10'::date,
      23,
      'Sunrise'
    ),
    (
      'gundam-evolve',
      'ガンダムEVOLVE',
      'Various directors',
      '2001-05-17'::date,
      null,
      'Sunrise'
    ),
    (
      'ring-of-gundam',
      'リング・オブ・ガンダム',
      'Yoshiyuki Tomino',
      '2009-08-21'::date,
      5,
      'Sunrise'
    ),
    (
      'gundam-build-real',
      'ガンダムビルドリアル',
      'Katsuyuki Motohiro / Yuuka Tanaka',
      '2021-03-29'::date,
      null,
      'Sunrise / LDS'
    ),
    (
      'mobile-suit-gundam-silver-phantom',
      '機動戦士ガンダム：銀灰の幻影',
      'Kenichi Suzuki',
      '2024-10-04'::date,
      90,
      'Bandai Namco Filmworks / Atlas V'
    ),
    (
      'mobile-suit-gundam-iron-blooded-orphans-wedge-of-interposition',
      '機動戦士ガンダム 鉄血のオルフェンズ 10周年記念新作短編 幕間の楔',
      'Tatsuyuki Nagai',
      '2025-10-31'::date,
      16,
      'Bandai Namco Filmworks / Sunrise'
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
  runtime_minutes = coalesce(
    metadata.runtime_minutes,
    series.runtime_minutes
  ),
  studio = metadata.studio,
  catalog_status = 'complete',
  updated_at = now()
from metadata
where series.slug = metadata.slug;

commit;