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
      'gundam-0079',
      '機動戦士ガンダム',
      'Yoshiyuki Tomino',
      date '1979-04-07',
      date '1980-01-26',
      'Sunrise'
    ),
    (
      'mobile-suit-zeta-gundam',
      '機動戦士Ζガンダム',
      'Yoshiyuki Tomino',
      date '1985-03-02',
      date '1986-02-22',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-zz',
      '機動戦士ガンダムΖΖ',
      'Yoshiyuki Tomino',
      date '1986-03-01',
      date '1987-01-31',
      'Sunrise'
    ),
    (
      'mobile-suit-victory-gundam',
      '機動戦士Vガンダム',
      'Yoshiyuki Tomino',
      date '1993-04-02',
      date '1994-03-25',
      'Sunrise'
    ),
    (
      'mobile-fighter-g-gundam',
      '機動武闘伝Gガンダム',
      'Yasuhiro Imagawa',
      date '1994-04-22',
      date '1995-03-31',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-wing',
      '新機動戦記ガンダムW',
      'Masashi Ikeda',
      date '1995-04-07',
      date '1996-03-29',
      'Sunrise'
    ),
    (
      'after-war-gundam-x',
      '機動新世紀ガンダムX',
      'Shinji Takamatsu',
      date '1996-04-05',
      date '1996-12-28',
      'Sunrise'
    ),
    (
      'turn-a-gundam',
      '∀ガンダム',
      'Yoshiyuki Tomino',
      date '1999-04-09',
      date '2000-04-14',
      'Sunrise'
    ),
    (
      'gundam-seed',
      '機動戦士ガンダムSEED',
      'Mitsuo Fukuda',
      date '2002-10-05',
      date '2003-09-27',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-seed-destiny',
      '機動戦士ガンダムSEED DESTINY',
      'Mitsuo Fukuda',
      date '2004-10-09',
      date '2005-10-01',
      'Sunrise'
    ),
    (
      'sd-gundam-force',
      'SDガンダムフォース',
      'Yuichi Abe',
      date '2004-01-07',
      date '2004-12-29',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-00',
      '機動戦士ガンダム00',
      'Seiji Mizushima',
      date '2007-10-06',
      date '2009-03-29',
      'Sunrise'
    ),
    (
      'sd-gundam-sangokuden-brave-battle-warriors',
      'SDガンダム三国伝 Brave Battle Warriors',
      'Kunihiro Mori',
      date '2010-04-03',
      date '2011-03-26',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-age',
      '機動戦士ガンダムAGE',
      'Susumu Yamaguchi',
      date '2011-10-09',
      date '2012-09-23',
      'Sunrise'
    ),
    (
      'gundam-build-fighters',
      'ガンダムビルドファイターズ',
      'Kenji Nagasaki',
      date '2013-10-07',
      date '2014-03-31',
      'Sunrise'
    ),
    (
      'gundam-build-fighters-try',
      'ガンダムビルドファイターズトライ',
      'Shinya Watada',
      date '2014-10-08',
      date '2015-04-01',
      'Sunrise'
    ),
    (
      'gundam-reconguista-in-g',
      'ガンダム Gのレコンギスタ',
      'Yoshiyuki Tomino',
      date '2014-10-03',
      date '2015-03-27',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-san',
      '機動戦士ガンダムさん',
      'Mankyu',
      date '2014-07-06',
      date '2014-09-28',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-iron-blooded-orphans',
      '機動戦士ガンダム 鉄血のオルフェンズ',
      'Tatsuyuki Nagai',
      date '2015-10-04',
      date '2017-04-02',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-unicorn-re-0096',
      '機動戦士ガンダムユニコーン RE:0096',
      'Kazuhiro Furuhashi',
      date '2016-04-03',
      date '2016-09-11',
      'Sunrise'
    ),
    (
      'gundam-build-divers',
      'ガンダムビルドダイバーズ',
      'Shinya Watada',
      date '2018-04-03',
      date '2018-09-25',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-the-origin-advent-of-the-red-comet',
      '機動戦士ガンダム THE ORIGIN 前夜 赤い彗星',
      'Takashi Imanishi',
      date '2019-04-29',
      date '2019-08-12',
      'Sunrise'
    ),
    (
      'mobile-suit-gundam-the-witch-from-mercury',
      '機動戦士ガンダム 水星の魔女',
      'Hiroshi Kobayashi',
      date '2022-10-02',
      date '2023-07-02',
      'Bandai Namco Filmworks'
    ),
    (
      'mobile-suit-gundam-gquuuuuux',
      '機動戦士Gundam GQuuuuuuX',
      'Kazuya Tsurumaki',
      date '2025-04-09',
      date '2025-06-25',
      'studio khara / Sunrise'
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