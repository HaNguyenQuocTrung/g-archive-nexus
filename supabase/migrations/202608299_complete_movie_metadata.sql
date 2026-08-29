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
      'mobile-suit-gundam-chars-counterattack',
      '機動戦士ガンダム 逆襲のシャア',
      'Yoshiyuki Tomino',
      124,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-f91',
      '機動戦士ガンダムF91',
      'Yoshiyuki Tomino',
      115,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-00-a-wakening-of-the-trailblazer',
      '劇場版 機動戦士ガンダム00 -A wakening of the Trailblazer-',
      'Seiji Mizushima',
      120,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-narrative',
      '機動戦士ガンダムNT',
      'Shunichi Yoshizawa',
      90,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-hathaway',
      '機動戦士ガンダム 閃光のハサウェイ',
      'Shukou Murase',
      95,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-cucuruz-doans-island',
      '機動戦士ガンダム ククルス・ドアンの島',
      'Yoshikazu Yasuhiko',
      108,
      'Bandai Namco Filmworks'
    ),
    (
      'gundam-seed-freedom',
      '機動戦士ガンダムSEED FREEDOM',
      'Mitsuo Fukuda',
      124,
      'Bandai Namco Filmworks'
    ),
    (
      'mobile-suit-gundam-hathaway-the-sorcery-of-nymph-circe',
      '機動戦士ガンダム 閃光のハサウェイ キルケーの魔女',
      'Shukou Murase',
      108,
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
  runtime_minutes = metadata.runtime_minutes,
  studio = metadata.studio,
  catalog_status = 'complete',
  updated_at = now()
from metadata
where series.slug = metadata.slug;

commit;