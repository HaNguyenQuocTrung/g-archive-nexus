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
      'after-colony',
      'mobile-suit-gundam-wing-endless-waltz',
      'Mobile Suit Gundam Wing: Endless Waltz',
      'The Gundam pilots face a new rebellion after attempting to leave their weapons and their lives as soldiers behind.',
      'ova',
      1997,
      1997,
      3,
      'AC 196',
      'https://en.gundam.info/about-gundam/series-pages/gundam-w/'
    ),
    (
      'standalone-alternative',
      'gundam-evolve',
      'Gundam Evolve',
      'A collection of experimental animated shorts featuring mobile suits and characters from several Gundam timelines.',
      'promotional-animation',
      2001,
      2007,
      15,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'cosmic-era',
      'mobile-suit-gundam-seed-ce73-stargazer',
      'Mobile Suit Gundam SEED C.E. 73: STARGAZER',
      'A civilian research project and an Earth Alliance mobile suit team cross paths during the conflict surrounding the Break the World incident.',
      'ona',
      2006,
      2006,
      3,
      'CE 73',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'gunpla-build',
      'model-suit-gunpla-builders-beginning-g',
      'Model Suit Gunpla Builders Beginning G',
      'A young builder discovers Gunpla Battle and learns to improve both his model-building and combat skills.',
      'ova',
      2010,
      2010,
      3,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'advanced-generation',
      'mobile-suit-gundam-age-memory-of-eden',
      'Mobile Suit Gundam AGE: Memory of Eden',
      'The conflict betweenThe conflict between Asemu Asuno and Zeheart Galette is retold with expanded events and additional material.',
      'ova',
      2013,
      2013,
      2,
      'AG 141–151',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'gunpla-build',
      'gundam-build-fighters-try-island-wars',
      'Gundam Build Fighters Try: Island Wars',
      'The Try Fighters reunite during a trip to a research facility where an experimental Gunpla Battle system loses control.',
      'special',
      2016,
      2016,
      1,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'gunpla-build',
      'gundam-build-fighters-battlogue',
      'Gundam Build Fighters Battlogue',
      'A collection of short Gunpla Battle stories featuring fighters and machines from the Build Fighters series.',
      'ona',
      2017,
      2017,
      5,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'gunpla-build',
      'gundam-build-fighters-gms-counterattack',
      'Gundam Build Fighters: GM''s Counterattack',
      'Sei and his friends confront a challenge connected to the Gunpla Mafia before an important new battle system is revealed.',
      'ona',
      2017,
      2017,
      1,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'gunpla-build',
      'gundam-build-divers-rerise',
      'Gundam Build Divers Re:RISE',
      'Hiroto and a newly formed team accept a mission in GBN that leads them into a conflict with consequences beyond the game.',
      'ona',
      2019,
      2020,
      26,
      null,
      'https://en.gundam.info/about-gundam/series-pages/builddivers_rerise.html'
    ),
    (
      'sd-gundam-worlds',
      'sd-gundam-world-sangoku-soketsuden',
      'SD Gundam World Sangoku Soketsuden',
      'Warriors from the Three Kingdoms fight to protect their world from a mysterious plague and competing factions.',
      'ona',
      2019,
      2021,
      10,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'gunpla-build',
      'gundam-breaker-battlogue',
      'Gundam Breaker Battlogue',
      'Gunpla fighters confront a powerful opponent who manipulates the battle system for revenge.',
      'ona',
      2021,
      2021,
      6,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'sd-gundam-worlds',
      'sd-gundam-world-heroes',
      'SD Gundam World Heroes',
      'Heroes from multiple SD Gundam worlds unite to confront a threat capable of destroying their shared universe.',
      'ona',
      2021,
      2021,
      24,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'ad-stella',
      'mobile-suit-gundam-the-witch-from-mercury-prologue',
      'Mobile Suit Gundam: The Witch from Mercury PROLOGUE',
      'The development of GUND-format mobile suits leads to a violent intervention at the Vanadis Institute.',
      'special',
      2022,
      2022,
      1,
      'AS 101',
      'https://en.gundam.info/about-gundam/series-pages/witch/'
    ),
    (
      'gunpla-build',
      'gundam-build-metaverse',
      'Gundam Build Metaverse',
      'A new Gunpla builder enters a metaverse where fighters and champions from different Build generations can meet.',
      'ona',
      2023,
      2023,
      3,
      null,
      'https://en.gundam.info/about-gundam/series-pages/buildmetaverse/'
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
  'Alternative, Build and SD animation catalog imported during M7. Metadata and individual sources require final verification.'
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