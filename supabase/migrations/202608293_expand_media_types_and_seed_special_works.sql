begin;

-- Xóa riêng CHECK constraint cũ liên quan tới media_type.
do $$
declare
  constraint_record record;
begin
  for constraint_record in
    select conname
    from pg_constraint
    where conrelid = 'public.series'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%media_type%'
  loop
    execute format(
      'alter table public.series drop constraint %I',
      constraint_record.conname
    );
  end loop;
end
$$;

alter table public.series
  add constraint series_media_type_check
  check (
    media_type is null
    or media_type in (
      'tv-series',
      'movie',
      'ova',
      'ona',
      'special',
      'compilation-movie',
      'short-film',
      'promotional-animation',
      'live-action-movie',
      'live-action-series',
      'vr-experience',
      'motion-comic',
      'music-video',
      'attraction-film'
    )
  );

create index if not exists series_media_type_release_year_idx
  on public.series (media_type, release_year);

with works (
  timeline_slug,
  slug,
  title,
  synopsis,
  media_type,
  release_date,
  release_year,
  episode_count,
  runtime_minutes,
  in_universe_year,
  official_url
) as (
  values
    (
      'standalone-alternative',
      'gundam-mission-to-the-rise',
      'Gundam: Mission to the Rise',
      'An experimental computer-generated Gundam short created as an anniversary presentation.',
      'short-film',
      null,
      1998,
      1,
      null,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'g-saviour',
      'G-Saviour',
      'A live-action Gundam production set in a distant Universal Century where food shortages and political conflict threaten the space colonies.',
      'live-action-movie',
      null,
      1999,
      1,
      null,
      'UC 0223',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'gundam-the-ride-a-baoa-qu',
      'Gundam the Ride: A Baoa Qu',
      'An attraction film placing its audience aboard a transport attempting to escape the Battle of A Baoa Qu.',
      'attraction-film',
      null,
      2000,
      1,
      null,
      'UC 0079',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'gundam-neo-experience-0087-green-divers',
      'Gundam Neo Experience 0087: Green Divers',
      'Two civilians attempt to escape a damaged passenger shuttle during the Gryps Conflict.',
      'attraction-film',
      null,
      2001,
      1,
      null,
      'UC 0087',
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'standalone-alternative',
      'ring-of-gundam',
      'Ring of Gundam',
      'A commemorative short depicting a distant future connected to the legacy of Gundam and human space civilization.',
      'short-film',
      null,
      2009,
      1,
      null,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'gunpla-build',
      'gundam-build-real',
      'Gundam Build Real',
      'A live-action series about former teammates reuniting to compete using scanned Gunpla in an augmented battle system.',
      'live-action-series',
      null,
      2021,
      6,
      null,
      null,
      'https://en.gundam.info/about-gundam/series-pages.html'
    ),
    (
      'universal-century',
      'mobile-suit-gundam-silver-phantom',
      'Mobile Suit Gundam: Silver Phantom',
      'An interactive VR feature placing the viewer inside a Universal Century conflict involving the mercenary organization Argent Keil.',
      'vr-experience',
      date '2024-10-04',
      2024,
      1,
      null,
      'UC 0096',
      'https://en.gundam.info/news/video-music/01_15590.html'
    ),
    (
      'post-disaster',
      'mobile-suit-gundam-iron-blooded-orphans-wedge-of-interposition',
      'Mobile Suit Gundam Iron-Blooded Orphans: Wedge of Interposition',
      'A new short story following Tekkadan after its return to Mars and the growth of its organization.',
      'short-film',
      date '2025-10-31',
      2025,
      1,
      null,
      'PD 325',
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
  episode_count,
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
  works.media_type,
  works.release_date,
  works.release_year,
  works.release_year,
  works.episode_count,
  works.runtime_minutes::integer,
  'published',
  works.in_universe_year,
  works.official_url,
  'in_progress',
  'Special-format work imported during M7. Exact runtime, staff and localized titles require verification.'
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
  episode_count = excluded.episode_count,
  runtime_minutes = excluded.runtime_minutes,
  status = excluded.status,
  in_universe_year = excluded.in_universe_year,
  official_url = excluded.official_url,
  catalog_status = excluded.catalog_status,
  catalog_notes = excluded.catalog_notes,
  updated_at = now();

commit;