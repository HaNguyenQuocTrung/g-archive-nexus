begin;

with works (
  timeline_slug,
  slug,
  title,
  synopsis,
  media_type,
  release_year,
  end_year,
  episode_count,
  in_universe_year,
  official_url
) as (
  values
    (
      'universal-century',
      'mobile-suit-gundam-0080-war-in-the-pocket',
      'Mobile Suit Gundam 0080: War in the Pocket',
      'A young boy living in a neutral colony becomes involved with a Zeon special operations team during the closing days of the One Year War.',
      'ova',
      1989,
      1989,
      6,
      'UC 0079–0080',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-0083-stardust-memory',
      'Mobile Suit Gundam 0083: Stardust Memory',
      'A Zeon remnant steals a nuclear-equipped Gundam prototype, drawing Federation pilot Kou Uraki into Operation Stardust.',
      'ova',
      1991,
      1992,
      13,
      'UC 0083',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-the-08th-ms-team',
      'Mobile Suit Gundam: The 08th MS Team',
      'A Federation mobile suit team fights a ground war in Southeast Asia while its commander develops a connection with a Zeon pilot.',
      'ova',
      1996,
      1999,
      12,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-ms-igloo-the-hidden-one-year-war',
      'Mobile Suit Gundam MS IGLOO: The Hidden One Year War',
      'Zeon technical evaluation personnel document experimental weapons and the soldiers assigned to test them during the One Year War.',
      'ova',
      2004,
      2004,
      3,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-ms-igloo-apocalypse-0079',
      'Mobile Suit Gundam MS IGLOO: Apocalypse 0079',
      'The crew of the Jotunheim continues evaluating experimental Zeon weapons as the One Year War approaches its conclusion.',
      'ova',
      2006,
      2006,
      3,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-ms-igloo-2-gravity-front',
      'Mobile Suit Gundam MS IGLOO 2: Gravity Front',
      'Federation ground forces confront Zeon mobile suits through several connected stories set during the One Year War.',
      'ova',
      2008,
      2009,
      3,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-unicorn',
      'Mobile Suit Gundam Unicorn',
      'Banagher Links becomes involved in a conflict over Laplace''s Box after encountering the Unicorn Gundam and Audrey Burne.',
      'ova',
      2010,
      2014,
      7,
      'UC 0096',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-the-origin',
      'Mobile Suit Gundam THE ORIGIN',
      'The political upheaval in Side 3 and the lives of Casval and Artesia reveal the events leading toward the One Year War.',
      'ova',
      2015,
      2018,
      6,
      'UC 0068–0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-thunderbolt',
      'Mobile Suit Gundam Thunderbolt',
      'Federation and Zeon forces fight for control of the debris-filled Thunderbolt Sector during and after the One Year War.',
      'ona',
      2015,
      2017,
      8,
      'UC 0079–0080',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-twilight-axis',
      'Mobile Suit Gundam Twilight AXIS',
      'A research team travels to the abandoned asteroid Axis and encounters unexpected resistance among its ruins.',
      'ona',
      2017,
      2017,
      6,
      'UC 0096',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-requiem-for-vengeance',
      'Mobile Suit Gundam: Requiem for Vengeance',
      'A Zeon mobile suit unit faces a powerful Federation Gundam during the European front of the One Year War.',
      'ona',
      2024,
      2024,
      6,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
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
  works.media_type,
  works.release_year,
  works.end_year,
  works.episode_count,
  'published',
  works.in_universe_year,
  works.official_url,
  'in_progress',
  'Universal Century OVA and ONA catalog imported during M7. Metadata and individual sources require final verification.'
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