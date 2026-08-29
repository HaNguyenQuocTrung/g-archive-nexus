begin;

with works (
  timeline_slug,
  slug,
  title,
  synopsis,
  release_year,
  end_year,
  episode_count,
  in_universe_year,
  official_url
) as (
  values
    (
      'universal-century',
      'gundam-0079',
      'Mobile Suit Gundam',
      'Humanity fights a devastating war between the Earth Federation and the Principality of Zeon, while the crew of White Base struggles to survive.',
      1979,
      1980,
      43,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-zeta-gundam',
      'Mobile Suit Zeta Gundam',
      'Years after the One Year War, resistance fighters oppose the oppressive Titans as a new generation is drawn into conflict.',
      1985,
      1986,
      50,
      'UC 0087',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-zz',
      'Mobile Suit Gundam ZZ',
      'The surviving Argama crew joins forces with young pilots from Side 1 while Neo Zeon expands its campaign.',
      1986,
      1987,
      47,
      'UC 0088',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-victory-gundam',
      'Mobile Suit Victory Gundam',
      'A young pilot becomes involved with the League Militaire during its resistance against the Zanscare Empire.',
      1993,
      1994,
      51,
      'UC 0153',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'future-century',
      'mobile-fighter-g-gundam',
      'Mobile Fighter G Gundam',
      'Representatives of the space colonies compete in the Gundam Fight while Domon Kasshu searches for his brother and the Devil Gundam.',
      1994,
      1995,
      49,
      'FC 60',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'after-colony',
      'mobile-suit-gundam-wing',
      'Mobile Suit Gundam Wing',
      'Five young Gundam pilots are sent from the colonies to challenge the military organization controlling Earth and space.',
      1995,
      1996,
      49,
      'AC 195',
      'https://en.gundam.info/about-gundam/series-pages/gundam-w/'
    ),
    (
      'after-war',
      'after-war-gundam-x',
      'After War Gundam X',
      'In a devastated postwar world, a young scavenger and the crew of the Freeden search for Newtypes while confronting the powers rebuilding civilization.',
      1996,
      1996,
      39,
      'AW 15',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'correct-century',
      'turn-a-gundam',
      'Turn A Gundam',
      'The return of the Moonrace threatens Earth as lost technology from the Dark History is uncovered.',
      1999,
      2000,
      50,
      'CC 2345',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'cosmic-era',
      'gundam-seed',
      'Mobile Suit Gundam SEED',
      'Kira Yamato is forced to pilot the Strike Gundam when war reaches the neutral colony where he lives.',
      2002,
      2003,
      50,
      'CE 71',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'cosmic-era',
      'mobile-suit-gundam-seed-destiny',
      'Mobile Suit Gundam SEED Destiny',
      'A renewed conflict between ZAFT and the Earth Alliance places Shinn Asuka and returning veterans at the center of another war.',
      2004,
      2005,
      50,
      'CE 73',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'anno-domini',
      'mobile-suit-gundam-00',
      'Mobile Suit Gundam 00',
      'Celestial Being deploys Gundams to eliminate armed conflict, changing the political and military balance of the world.',
      2007,
      2009,
      50,
      'AD 2307–2312',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'advanced-generation',
      'mobile-suit-gundam-age',
      'Mobile Suit Gundam AGE',
      'Three generations of the Asuno family fight a long war against the mysterious enemy later known as the Vagans.',
      2011,
      2012,
      49,
      'AG 115–164',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'regild-century',
      'gundam-reconguista-in-g',
      'Gundam Reconguista in G',
      'A cadet protecting the Capital Tower becomes connected to the mysterious G-Self and a conflict over humanity''s energy supply.',
      2014,
      2015,
      26,
      'RC 1014',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'post-disaster',
      'mobile-suit-gundam-iron-blooded-orphans',
      'Mobile Suit Gundam: Iron-Blooded Orphans',
      'Young workers on Mars form Tekkadan and escort Kudelia Aina Bernstein while seeking freedom and a better future.',
      2015,
      2017,
      50,
      'PD 323–325',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-unicorn-re-0096',
      'Mobile Suit Gundam Unicorn RE:0096',
      'Banagher Links becomes the pilot of the Unicorn Gundam and is drawn into the struggle over Laplace''s Box.',
      2016,
      2016,
      22,
      'UC 0096',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-the-origin-advent-of-the-red-comet',
      'Mobile Suit Gundam THE ORIGIN: Advent of the Red Comet',
      'The events leading toward the One Year War reveal the rise of Casval Rem Deikun as Char Aznable.',
      2019,
      2019,
      13,
      'UC 0068–0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'ad-stella',
      'mobile-suit-gundam-the-witch-from-mercury',
      'Mobile Suit Gundam: The Witch from Mercury',
      'Suletta Mercury enters the Asticassia School of Technology with the Gundam Aerial and becomes entangled in corporate conflict.',
      2022,
      2023,
      24,
      'AS 122',
      'https://en.gundam.info/about-gundam/series-pages/witch/'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-gquuuuuux',
      'Mobile Suit Gundam GQuuuuuuX',
      'Amate Yuzuriha enters illegal mobile suit Clan Battles after encountering a mysterious Gundam and its pilot.',
      2025,
      2025,
      12,
      'UC 0079 — Alternative History',
      'https://en.gundam.info/about-gundam/series-pages/gquuuuuux/'
    )
)

insert into public.series (
  timeline_id,
  slug,
  title,
  titles,
  synopsis,
  media_type,
  release_year,
  end_year,
  episode_count,
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
  'tv-series',
  works.release_year,
  works.end_year,
  works.episode_count,
  'published',
  works.in_universe_year,
  works.official_url,
  'in_progress',
  'Core television catalog imported during M7. Metadata and sources require final verification.'
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
  release_year = excluded.release_year,
  end_year = excluded.end_year,
  episode_count = excluded.episode_count,
  status = excluded.status,
  in_universe_year = excluded.in_universe_year,
  official_url = excluded.official_url,
  catalog_status = excluded.catalog_status,
  catalog_notes = excluded.catalog_notes,
  updated_at = now();

commit;