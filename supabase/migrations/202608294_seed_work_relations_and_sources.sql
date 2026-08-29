begin;

-- =========================================================
-- 1. OFFICIAL REFERENCE SOURCES
-- =========================================================

with sources (
  title,
  url,
  publisher,
  source_type
) as (
  values
    (
      'Gundam Official Series Catalog',
      'https://en.gundam.info/about-gundam/series-pages.html',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'Gundam Official — What Is Gundam',
      'https://en.gundam.info/what-is-gundam/',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'Mobile Suit Gundam Wing Official Website',
      'https://en.gundam.info/about-gundam/series-pages/gundam-w/',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'Gundam Build Fighters Official Website',
      'https://en.gundam.info/series/buildfighters/',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'Gundam Build Divers Re:RISE Official Website',
      'https://en.gundam.info/about-gundam/series-pages/builddivers_rerise.html',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'Gundam Build Metaverse Official Website',
      'https://en.gundam.info/about-gundam/series-pages/buildmetaverse/',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'The Witch from Mercury Official Website',
      'https://en.gundam.info/about-gundam/series-pages/witch/',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'Mobile Suit Gundam Narrative Official Website',
      'https://en.gundam.info/about-gundam/series-pages/narrative.html',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'Mobile Suit Gundam Hathaway Official Website',
      'https://en.gundam-official.com/hathaway/',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'Mobile Suit Gundam SEED FREEDOM Official Website',
      'https://en.gundam.info/about-gundam/series-pages/seedfreedom/',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'Mobile Suit Gundam GQuuuuuuX Official Website',
      'https://en.gundam.info/about-gundam/series-pages/gquuuuuux/',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'Iron-Blooded Orphans Urdr-Hunt Official Website',
      'https://en.gundam.info/about-gundam/series-pages/g-orphans/movie/',
      'Bandai Namco Filmworks',
      'official'
    ),
    (
      'Mobile Suit Gundam Silver Phantom Official Announcement',
      'https://en.gundam.info/news/video-music/01_15590.html',
      'Bandai Namco Filmworks',
      'official'
    )
)

insert into public.reference_sources (
  title,
  url,
  publisher,
  source_type,
  accessed_at
)
select
  title,
  url,
  publisher,
  source_type,
  current_date
from sources

on conflict (url) do update
set
  title = excluded.title,
  publisher = excluded.publisher,
  source_type = excluded.source_type,
  accessed_at = excluded.accessed_at;

-- Gắn official_url hiện tại của mỗi work với reference_sources.
insert into public.series_sources (
  series_id,
  source_id,
  is_primary,
  notes
)
select
  series.id,
  reference_sources.id,
  true,
  'Primary official catalog or title-specific source.'
from public.series
join public.reference_sources
  on reference_sources.url = series.official_url
where series.official_url is not null

on conflict (series_id, source_id) do update
set
  is_primary = excluded.is_primary,
  notes = excluded.notes;

-- Thêm nguồn catalog chung cho những work chưa có source.
insert into public.series_sources (
  series_id,
  source_id,
  is_primary,
  notes
)
select
  series.id,
  reference_sources.id,
  true,
  'General Gundam Official catalog reference.'
from public.series
cross join public.reference_sources
where reference_sources.url =
  'https://en.gundam.info/about-gundam/series-pages.html'
  and not exists (
    select 1
    from public.series_sources
    where series_sources.series_id = series.id
  )

on conflict (series_id, source_id) do nothing;

-- =========================================================
-- 2. WORK RELATIONS
-- =========================================================

with relation_pairs (
  source_slug,
  target_slug,
  relation_type,
  notes
) as (
  values
    -- Universal Century chronology
    (
      'gundam-0079',
      'mobile-suit-zeta-gundam',
      'sequel',
      'Zeta Gundam continues the Universal Century story after the One Year War.'
    ),
    (
      'mobile-suit-zeta-gundam',
      'gundam-0079',
      'prequel',
      'Mobile Suit Gundam precedes Zeta Gundam.'
    ),
    (
      'mobile-suit-zeta-gundam',
      'mobile-suit-gundam-zz',
      'sequel',
      'Gundam ZZ directly follows the conclusion of Zeta Gundam.'
    ),
    (
      'mobile-suit-gundam-zz',
      'mobile-suit-zeta-gundam',
      'prequel',
      'Zeta Gundam precedes Gundam ZZ.'
    ),
    (
      'mobile-suit-gundam-zz',
      'mobile-suit-gundam-chars-counterattack',
      'sequel',
      'Char''s Counterattack occurs later in the Universal Century.'
    ),
    (
      'mobile-suit-gundam-chars-counterattack',
      'mobile-suit-gundam-zz',
      'prequel',
      'Gundam ZZ occurs before Char''s Counterattack.'
    ),
    (
      'mobile-suit-gundam-unicorn',
      'mobile-suit-gundam-narrative',
      'sequel',
      'Narrative continues story elements introduced by Unicorn.'
    ),
    (
      'mobile-suit-gundam-narrative',
      'mobile-suit-gundam-unicorn',
      'prequel',
      'Unicorn precedes Narrative.'
    ),
    (
      'mobile-suit-gundam-chars-counterattack',
      'mobile-suit-gundam-hathaway',
      'sequel',
      'Hathaway follows events and consequences connected to Char''s Counterattack.'
    ),
    (
      'mobile-suit-gundam-hathaway',
      'mobile-suit-gundam-chars-counterattack',
      'prequel',
      'Char''s Counterattack precedes Hathaway.'
    ),
    (
      'mobile-suit-gundam-hathaway',
      'mobile-suit-gundam-hathaway-the-sorcery-of-nymph-circe',
      'sequel',
      'The Sorcery of Nymph Circe is the second Hathaway film.'
    ),
    (
      'mobile-suit-gundam-hathaway-the-sorcery-of-nymph-circe',
      'mobile-suit-gundam-hathaway',
      'prequel',
      'Mobile Suit Gundam Hathaway is the preceding film.'
    ),

    -- Alternative timeline sequels
    (
      'gundam-seed',
      'mobile-suit-gundam-seed-destiny',
      'sequel',
      'SEED Destiny follows Mobile Suit Gundam SEED.'
    ),
    (
      'mobile-suit-gundam-seed-destiny',
      'gundam-seed',
      'prequel',
      'Mobile Suit Gundam SEED precedes SEED Destiny.'
    ),
    (
      'mobile-suit-gundam-seed-destiny',
      'gundam-seed-freedom',
      'sequel',
      'SEED FREEDOM continues the Cosmic Era story after SEED Destiny.'
    ),
    (
      'gundam-seed-freedom',
      'mobile-suit-gundam-seed-destiny',
      'prequel',
      'SEED Destiny precedes SEED FREEDOM.'
    ),
    (
      'mobile-suit-gundam-00',
      'mobile-suit-gundam-00-a-wakening-of-the-trailblazer',
      'sequel',
      'A Wakening of the Trailblazer continues the Gundam 00 story.'
    ),
    (
      'mobile-suit-gundam-00-a-wakening-of-the-trailblazer',
      'mobile-suit-gundam-00',
      'prequel',
      'The Gundam 00 television series precedes the movie.'
    ),
    (
      'mobile-suit-gundam-the-witch-from-mercury-prologue',
      'mobile-suit-gundam-the-witch-from-mercury',
      'sequel',
      'The Witch from Mercury follows the events of PROLOGUE.'
    ),
    (
      'mobile-suit-gundam-the-witch-from-mercury',
      'mobile-suit-gundam-the-witch-from-mercury-prologue',
      'prequel',
      'PROLOGUE occurs before the television series.'
    ),

    -- Build chronology
    (
      'gundam-build-fighters',
      'gundam-build-fighters-try',
      'sequel',
      'Build Fighters Try follows Gundam Build Fighters.'
    ),
    (
      'gundam-build-fighters-try',
      'gundam-build-fighters',
      'prequel',
      'Gundam Build Fighters precedes Build Fighters Try.'
    ),
    (
      'gundam-build-fighters-try',
      'gundam-build-fighters-try-island-wars',
      'sequel',
      'Island Wars follows the Build Fighters Try television series.'
    ),
    (
      'gundam-build-divers',
      'gundam-build-divers-rerise',
      'sequel',
      'Re:RISE is set after Gundam Build Divers.'
    ),
    (
      'gundam-build-divers-rerise',
      'gundam-build-divers',
      'prequel',
      'Gundam Build Divers precedes Re:RISE.'
    ),

    -- Side stories
    (
      'gundam-seed',
      'mobile-suit-gundam-seed-ce73-stargazer',
      'side-story',
      'STARGAZER is a Cosmic Era side story.'
    ),
    (
      'mobile-suit-gundam-iron-blooded-orphans',
      'mobile-suit-gundam-iron-blooded-orphans-urdr-hunt-path-of-the-little-challenger',
      'side-story',
      'Urdr-Hunt is a Post Disaster side story.'
    ),
    (
      'mobile-suit-gundam-iron-blooded-orphans',
      'mobile-suit-gundam-iron-blooded-orphans-wedge-of-interposition',
      'side-story',
      'Wedge of Interposition is a short story involving Tekkadan.'
    ),

    -- Alternate television/OVA versions
    (
      'mobile-suit-gundam-unicorn',
      'mobile-suit-gundam-unicorn-re-0096',
      'alternate-version',
      'RE:0096 is the television re-edit of the Unicorn OVA.'
    ),
    (
      'mobile-suit-gundam-the-origin',
      'mobile-suit-gundam-the-origin-advent-of-the-red-comet',
      'alternate-version',
      'Advent of the Red Comet is the television re-edit of THE ORIGIN.'
    ),
    (
      'mobile-suit-gundam-age',
      'mobile-suit-gundam-age-memory-of-eden',
      'alternate-version',
      'Memory of Eden retells and expands part of Gundam AGE.'
    ),

    -- Remake
    (
      'gundam-0079',
      'mobile-suit-gundam-cucuruz-doans-island',
      'remake',
      'Cucuruz Doan''s Island reimagines a story from the original television series.'
    ),

    -- Compilation films
    (
      'gundam-0079',
      'mobile-suit-gundam-i',
      'compilation',
      'First compilation film.'
    ),
    (
      'gundam-0079',
      'mobile-suit-gundam-ii-soldiers-of-sorrow',
      'compilation',
      'Second compilation film.'
    ),
    (
      'gundam-0079',
      'mobile-suit-gundam-iii-encounters-in-space',
      'compilation',
      'Third compilation film.'
    ),
    (
      'mobile-suit-zeta-gundam',
      'mobile-suit-zeta-gundam-a-new-translation-i-heirs-to-the-stars',
      'compilation',
      'First A New Translation film.'
    ),
    (
      'mobile-suit-zeta-gundam',
      'mobile-suit-zeta-gundam-a-new-translation-ii-lovers',
      'compilation',
      'Second A New Translation film.'
    ),
    (
      'mobile-suit-zeta-gundam',
      'mobile-suit-zeta-gundam-a-new-translation-iii-love-is-the-pulse-of-the-stars',
      'compilation',
      'Third A New Translation film.'
    ),
    (
      'mobile-suit-gundam-0083-stardust-memory',
      'mobile-suit-gundam-0083-the-last-blitz-of-zeon',
      'compilation',
      'Theatrical compilation of Stardust Memory.'
    ),
    (
      'mobile-suit-gundam-the-08th-ms-team',
      'mobile-suit-gundam-the-08th-ms-team-millers-report',
      'compilation',
      'Compilation and investigative retelling of The 08th MS Team.'
    ),
    (
      'mobile-suit-gundam-wing-endless-waltz',
      'mobile-suit-gundam-wing-endless-waltz-special-edition',
      'compilation',
      'Theatrical edition of Endless Waltz.'
    ),
    (
      'turn-a-gundam',
      'turn-a-gundam-i-earth-light',
      'compilation',
      'First Turn A compilation film.'
    ),
    (
      'turn-a-gundam',
      'turn-a-gundam-ii-moonlight-butterfly',
      'compilation',
      'Second Turn A compilation film.'
    ),
    (
      'mobile-suit-gundam-thunderbolt',
      'mobile-suit-gundam-thunderbolt-december-sky',
      'compilation',
      'Compilation of the first Thunderbolt arc.'
    ),
    (
      'mobile-suit-gundam-thunderbolt',
      'mobile-suit-gundam-thunderbolt-bandit-flower',
      'compilation',
      'Compilation of the second Thunderbolt arc.'
    ),
    (
      'mobile-suit-gundam-twilight-axis',
      'mobile-suit-gundam-twilight-axis-red-trace',
      'compilation',
      'Theatrical compilation of Twilight AXIS.'
    ),
    (
      'gundam-reconguista-in-g',
      'gundam-reconguista-in-g-i-go-core-fighter',
      'compilation',
      'First Reconguista in G compilation film.'
    ),
    (
      'gundam-reconguista-in-g',
      'gundam-reconguista-in-g-ii-bellris-fierce-charge',
      'compilation',
      'Second Reconguista in G compilation film.'
    ),
    (
      'gundam-reconguista-in-g',
      'gundam-reconguista-in-g-iii-legacy-from-space',
      'compilation',
      'Third Reconguista in G compilation film.'
    ),
    (
      'gundam-reconguista-in-g',
      'gundam-reconguista-in-g-iv-love-that-cries-out-in-battle',
      'compilation',
      'Fourth Reconguista in G compilation film.'
    ),
    (
      'gundam-reconguista-in-g',
      'gundam-reconguista-in-g-v-beyond-the-peril-of-death',
      'compilation',
      'Fifth Reconguista in G compilation film.'
    ),
    (
      'mobile-suit-gundam-gquuuuuux',
      'mobile-suit-gundam-gquuuuuux-beginning',
      'compilation',
      'Beginning reconstructs the opening of the television series.'
    )
)

insert into public.work_relations (
  source_series_id,
  target_series_id,
  relation_type,
  notes
)
select
  source_work.id,
  target_work.id,
  relation_pairs.relation_type,
  relation_pairs.notes
from relation_pairs
join public.series as source_work
  on source_work.slug = relation_pairs.source_slug
join public.series as target_work
  on target_work.slug = relation_pairs.target_slug

on conflict (
  source_series_id,
  target_series_id,
  relation_type
) do update
set notes = excluded.notes;

commit;