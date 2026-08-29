begin;

with works (
  timeline_slug,
  slug,
  title,
  synopsis,
  release_date,
  release_year,
  in_universe_year,
  official_url
) as (
  values
    (
      'universal-century',
      'mobile-suit-gundam-i',
      'Mobile Suit Gundam I',
      'The opening portion of the original Mobile Suit Gundam story, re-edited for theatrical presentation.',
      date '1981-03-14',
      1981,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-ii-soldiers-of-sorrow',
      'Mobile Suit Gundam II: Soldiers of Sorrow',
      'The middle portion of the original Mobile Suit Gundam story, following White Base through the continuing One Year War.',
      date '1981-07-11',
      1981,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-iii-encounters-in-space',
      'Mobile Suit Gundam III: Encounters in Space',
      'The concluding theatrical chapter of the original Mobile Suit Gundam story.',
      date '1982-03-13',
      1982,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-0083-the-last-blitz-of-zeon',
      'Mobile Suit Gundam 0083: The Last Blitz of Zeon',
      'A theatrical compilation of Stardust Memory covering the theft of Gundam Unit 2 and Operation Stardust.',
      date '1992-08-29',
      1992,
      'UC 0083',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-the-08th-ms-team-millers-report',
      'Mobile Suit Gundam: The 08th MS Team — Miller''s Report',
      'An investigative retelling of events involving Shiro Amada and the 08th Mobile Suit Team.',
      date '1998-08-01',
      1998,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'after-colony',
      'mobile-suit-gundam-wing-endless-waltz-special-edition',
      'Mobile Suit Gundam Wing: Endless Waltz Special Edition',
      'The theatrical edition of Endless Waltz with re-edited footage and additional material.',
      date '1998-08-01',
      1998,
      'AC 196',
      'https://en.gundam.info/about-gundam/series-pages/gundam-w/'
    ),
    (
      'correct-century',
      'turn-a-gundam-i-earth-light',
      'Turn A Gundam I: Earth Light',
      'The first theatrical compilation of Turn A Gundam.',
      null,
      2002,
      'CC 2345',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'correct-century',
      'turn-a-gundam-ii-moonlight-butterfly',
      'Turn A Gundam II: Moonlight Butterfly',
      'The concluding theatrical compilation of Turn A Gundam.',
      null,
      2002,
      'CC 2345',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-zeta-gundam-a-new-translation-i-heirs-to-the-stars',
      'Mobile Suit Zeta Gundam: A New Translation I — Heirs to the Stars',
      'The first film in the Zeta Gundam theatrical trilogy, combining original footage with newly produced animation.',
      date '2005-05-28',
      2005,
      'UC 0087',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-zeta-gundam-a-new-translation-ii-lovers',
      'Mobile Suit Zeta Gundam: A New Translation II — Lovers',
      'The second film in the Zeta Gundam theatrical trilogy.',
      date '2005-10-29',
      2005,
      'UC 0087',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-zeta-gundam-a-new-translation-iii-love-is-the-pulse-of-the-stars',
      'Mobile Suit Zeta Gundam: A New Translation III — Love Is the Pulse of the Stars',
      'The concluding film in the Zeta Gundam theatrical trilogy.',
      date '2006-03-04',
      2006,
      'UC 0087',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-thunderbolt-december-sky',
      'Mobile Suit Gundam Thunderbolt: December Sky',
      'A theatrical compilation of the first Thunderbolt story arc.',
      date '2016-06-25',
      2016,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-thunderbolt-bandit-flower',
      'Mobile Suit Gundam Thunderbolt: Bandit Flower',
      'A theatrical compilation continuing the conflict involving Io Fleming and Daryl Lorenz.',
      date '2017-11-18',
      2017,
      'UC 0080',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-twilight-axis-red-trace',
      'Mobile Suit Gundam Twilight AXIS: Red Trace',
      'A theatrical compilation of Twilight AXIS with additional material.',
      date '2017-11-18',
      2017,
      'UC 0096',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'regild-century',
      'gundam-reconguista-in-g-i-go-core-fighter',
      'Gundam Reconguista in G I: Go! Core Fighter',
      'The first film in the five-part theatrical reconstruction of Reconguista in G.',
      date '2019-11-29',
      2019,
      'RC 1014',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'regild-century',
      'gundam-reconguista-in-g-ii-bellris-fierce-charge',
      'Gundam Reconguista in G II: Bellri''s Fierce Charge',
      'The second film in the Reconguista in G theatrical series.',
      date '2020-02-21',
      2020,
      'RC 1014',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'regild-century',
      'gundam-reconguista-in-g-iii-legacy-from-space',
      'Gundam Reconguista in G III: Legacy from Space',
      'The third film in the Reconguista in G theatrical series.',
      date '2021-07-22',
      2021,
      'RC 1014',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'regild-century',
      'gundam-reconguista-in-g-iv-love-that-cries-out-in-battle',
      'Gundam Reconguista in G IV: Love That Cries Out in Battle',
      'The fourth film in the Reconguista in G theatrical series.',
      date '2022-07-22',
      2022,
      'RC 1014',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'regild-century',
      'gundam-reconguista-in-g-v-beyond-the-peril-of-death',
      'Gundam Reconguista in G V: Beyond the Peril of Death',
      'The concluding film in the Reconguista in G theatrical series.',
      date '2022-08-05',
      2022,
      'RC 1014',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-gquuuuuux-beginning',
      'Mobile Suit Gundam GQuuuuuuX -Beginning-',
      'A theatrical reconstruction of the opening events of Mobile Suit Gundam GQuuuuuuX.',
      date '2025-01-17',
      2025,
      'UC 0079 — Alternative History',
      'https://en.gundam.info/about-gundam/series-pages/gquuuuuux/'
    ),
    (
      'post-disaster',
      'mobile-suit-gundam-iron-blooded-orphans-urdr-hunt-path-of-the-little-challenger',
      'Mobile Suit Gundam Iron-Blooded Orphans Urdr-Hunt: Path of the Little Challenger',
      'A special theatrical edition of the Urdr-Hunt story following Wistario Afam and the competition surrounding a vast prize.',
      date '2025-10-31',
      2025,
      'PD 323',
      'https://en.gundam.info/about-gundam/series-pages/g-orphans/movie/'
    )
)

insert into public.series (
  timeline_id,
  slug,
  title,
  titles,
  synopsis,
  media_type,
  release_date,
  release_year,
  end_year,
  status,
  in_universe_year,
  official_url,
  catalog_status,
  catalog_notes
)
select
  timelines.id,
  works.slug,
  works.title,
  jsonb_build_object('en', works.title),
  works.synopsis,
  'compilation-movie',
  works.release_date,
  works.release_year,
  works.release_year,
  'published',
  works.in_universe_year,
  works.official_url,
  'in_progress',
  'Compilation movie imported during M7. Runtime, staff and localized titles require final verification.'
from works
join public.timelines
  on timelines.slug = works.timeline_slug

on conflict (slug) do update
set
  timeline_id = excluded.timeline_id,
  title = excluded.title,
  titles = excluded.titles,
  synopsis = excluded.synopsis,
  media_type = excluded.media_type,
  release_date = excluded.release_date,
  release_year = excluded.release_year,
  end_year = excluded.end_year,
  status = excluded.status,
  in_universe_year = excluded.in_universe_year,
  official_url = excluded.official_url,
  catalog_status = excluded.catalog_status,
  catalog_notes = excluded.catalog_notes,
  updated_at = now();

commit;