begin;

with works (
  timeline_slug,
  slug,
  title,
  synopsis,
  release_date,
  release_year,
  runtime_minutes,
  in_universe_year,
  official_url
) as (
  values
    (
      'universal-century',
      'mobile-suit-gundam-chars-counterattack',
      'Mobile Suit Gundam: Char''s Counterattack',
      'Amuro Ray and Char Aznable confront one another for the final time as Neo Zeon attempts to force humanity away from Earth.',
      date '1988-03-12',
      1988,
      124,
      'UC 0093',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-f91',
      'Mobile Suit Gundam F91',
      'A new conflict reaches the colony Frontier IV, forcing Seabook Arno to pilot the Gundam F91 against the Crossbone Vanguard.',
      date '1991-03-16',
      1991,
      115,
      'UC 0123',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'anno-domini',
      'mobile-suit-gundam-00-a-wakening-of-the-trailblazer',
      'Mobile Suit Gundam 00 the Movie: A Wakening of the Trailblazer',
      'Celestial Being confronts an extraterrestrial intelligence as Setsuna F. Seiei seeks a path toward mutual understanding.',
      date '2010-09-18',
      2010,
      120,
      'AD 2314',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-narrative',
      'Mobile Suit Gundam Narrative',
      'The search for the missing Phenex Gundam draws Jona Basta into a conflict involving the legacy of the Unicorn Gundams.',
      date '2018-11-30',
      2018,
      90,
      'UC 0097',
      'https://en.gundam.info/about-gundam/series-pages/narrative.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-hathaway',
      'Mobile Suit Gundam Hathaway',
      'Hathaway Noa joins the anti-Federation organization Mafty while becoming entangled with Gigi Andalucia and Kenneth Sleg.',
      date '2021-06-11',
      2021,
      95,
      'UC 0105',
      'https://en.gundam-official.com/hathaway/'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-cucuruz-doans-island',
      'Mobile Suit Gundam: Cucuruz Doan''s Island',
      'Amuro Ray encounters a former Zeon soldier protecting war orphans on an isolated island during the One Year War.',
      date '2022-06-03',
      2022,
      108,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'cosmic-era',
      'gundam-seed-freedom',
      'Mobile Suit Gundam SEED FREEDOM',
      'Kira Yamato and his allies in COMPASS intervene in international conflicts while a new kingdom advances a dangerous plan.',
      date '2024-01-26',
      2024,
      124,
      'CE 75',
      'https://en.gundam.info/about-gundam/series-pages/seedfreedom/'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-hathaway-the-sorcery-of-nymph-circe',
      'MOBILE SUIT GUNDAM HATHAWAY The Sorcery of Nymph Circe',
      'The conflict between Mafty and the Earth Federation continues as Hathaway faces the consequences of his choices and his connection with Gigi.',
      date '2026-01-30',
      2026,
      null,
      'UC 0105',
      'https://en.gundam-official.com/hathaway/'
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
  runtime_minutes,
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
  'movie',
  works.release_date,
  works.release_year,
  works.release_year,
  works.runtime_minutes,
  'published',
  works.in_universe_year,
  works.official_url,
  'in_progress',
  'Core theatrical movie imported during M7. Staff, localized titles and individual reference sources require final verification.'
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
  runtime_minutes = excluded.runtime_minutes,
  status = excluded.status,
  in_universe_year = excluded.in_universe_year,
  official_url = excluded.official_url,
  catalog_status = excluded.catalog_status,
  catalog_notes = excluded.catalog_notes,
  updated_at = now();

commit;