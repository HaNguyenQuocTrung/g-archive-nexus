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
      'sd-gundam-worlds',
      'sd-gundam-force',
      'SD Gundam Force',
      'The Super Dimensional Guard protects Neotopia with the help of Captain Gundam and allies drawn from several SD Gundam worlds.',
      2004,
      2004,
      52,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'sd-gundam-worlds',
      'sd-gundam-sangokuden-brave-battle-warriors',
      'SD Gundam Sangokuden Brave Battle Warriors',
      'Heroes inspired by the Three Kingdoms struggle to unite the land of Mirisha during an age of warfare.',
      2010,
      2011,
      51,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'gunpla-build',
      'gundam-build-fighters',
      'Gundam Build Fighters',
      'Gunpla builder Sei Iori and mysterious fighter Reiji form a team to compete in the Gunpla Battle World Championship.',
      2013,
      2014,
      25,
      null,
      'https://en.gundam.info/series/buildfighters/'
    ),
    (
      'gunpla-build',
      'gundam-build-fighters-try',
      'Gundam Build Fighters Try',
      'Three students revive their school Gunpla Battle club and enter a national team competition.',
      2014,
      2015,
      25,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'standalone-alternative',
      'mobile-suit-gundam-san',
      'Mobile Suit Gundam-san',
      'A short-form comedy that reinterprets familiar characters and situations from the original Mobile Suit Gundam.',
      2014,
      2014,
      13,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'gunpla-build',
      'gundam-build-divers',
      'Gundam Build Divers',
      'Riku Mikami and his friends form a force inside the virtual Gunpla Battle Nexus Online world.',
      2018,
      2018,
      25,
      null,
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
  'tv-series',
  works.release_year,
  works.end_year,
  works.episode_count,
  'published',
  works.in_universe_year,
  works.official_url,
  'in_progress',
  'Additional television catalog imported during M7. Metadata and sources require final verification.'
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