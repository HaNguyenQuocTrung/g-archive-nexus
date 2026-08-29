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
      'mobile-suit-gundam-i',
      '劇場版 機動戦士ガンダム',
      'Yoshiyuki Tomino',
      '1981-03-14'::date,
      137,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-ii-soldiers-of-sorrow',
      '機動戦士ガンダムII 哀・戦士編',
      'Yoshiyuki Tomino',
      '1981-07-11'::date,
      134,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-iii-encounters-in-space',
      '機動戦士ガンダムIII めぐりあい宇宙編',
      'Yoshiyuki Tomino',
      '1982-03-13'::date,
      141,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-0083-the-last-blitz-of-zeon',
      '機動戦士ガンダム0083 ジオンの残光',
      'Takashi Imanishi',
      '1992-08-29'::date,
      120,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-wing-endless-waltz-special-edition',
      '新機動戦記ガンダムW Endless Waltz 特別篇',
      'Yasunao Aoki',
      '1998-08-01'::date,
      90,
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-the-08th-ms-team-millers-report',
      '機動戦士ガンダム 第08MS小隊 ミラーズ・リポート',
      'Mitsuko Kase',
      '1998-08-01'::date,
      50,
      'Sunrise'
    ),
    (
      'turn-a-gundam-i-earth-light',
      '劇場版∀ガンダムI 地球光',
      'Yoshiyuki Tomino',
      '2002-02-09'::date,
      130,
      'Sunrise'
    ),
    (
      'turn-a-gundam-ii-moonlight-butterfly',
      '劇場版∀ガンダムII 月光蝶',
      'Yoshiyuki Tomino',
      '2002-02-10'::date,
      131,
      'Sunrise'
    ),
    (
      'mobile-suit-zeta-gundam-a-new-translation-i-heirs-to-the-stars',
      '機動戦士Ζガンダム A New Translation -星を継ぐ者-',
      'Yoshiyuki Tomino',
      '2005-05-28'::date,
      95,
      'Sunrise'
    ),
    (
      'mobile-suit-zeta-gundam-a-new-translation-ii-lovers',
      '機動戦士ΖガンダムII A New Translation -恋人たち-',
      'Yoshiyuki Tomino',
      '2005-10-29'::date,
      98,
      'Sunrise'
    ),
    (
      'mobile-suit-zeta-gundam-a-new-translation-iii-love-is-the-pulse-of-the-stars',
      '機動戦士ΖガンダムIII A New Translation -星の鼓動は愛-',
      'Yoshiyuki Tomino',
      '2006-03-04'::date,
      99,
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
  runtime_minutes = metadata.runtime_minutes,
  studio = metadata.studio,
  catalog_status = 'complete',
  updated_at = now()
from metadata
where series.slug = metadata.slug;

commit;