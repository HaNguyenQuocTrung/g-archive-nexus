begin;

insert into public.timelines (
  slug,
  name,
  code,
  description,
  status
)
values
  (
    'future-century',
    'Future Century',
    'FC',
    'The era of the Gundam Fight, where space colonies select representatives to compete for political authority.',
    'published'
  ),
  (
    'after-colony',
    'After Colony',
    'AC',
    'A timeline defined by the conflict between Earth, the space colonies and the Gundam pilots sent to oppose oppression.',
    'published'
  ),
  (
    'after-war',
    'After War',
    'AW',
    'A post-apocalyptic era following a catastrophic space war that devastated Earth and its colonies.',
    'published'
  ),
  (
    'correct-century',
    'Correct Century',
    'CC',
    'A distant era in which advanced technology from humanity''s past survives as the sealed Dark History.',
    'published'
  ),
  (
    'anno-domini',
    'Anno Domini',
    'AD',
    'An era where Celestial Being uses Gundams to intervene in warfare and challenge the existing world order.',
    'published'
  ),
  (
    'advanced-generation',
    'Advanced Generation',
    'AG',
    'A timeline following several generations of the Asuno family during humanity''s conflict with the Vagans.',
    'published'
  ),
  (
    'regild-century',
    'Regild Century',
    'RC',
    'An era following the Universal Century, built around the Capital Tower and the distribution of Photon Batteries.',
    'published'
  ),
  (
    'post-disaster',
    'Post Disaster',
    'PD',
    'A timeline set centuries after the Calamity War, where competing powers influence Earth and the Martian colonies.',
    'published'
  ),
  (
    'ad-stella',
    'Ad Stella',
    'AS',
    'An era dominated by space-based corporations, advanced mobile suits and conflict surrounding GUND technology.',
    'published'
  ),
  (
    'gunpla-build',
    'Gunpla Build Worlds',
    'BUILD',
    'A catalog grouping for stories centered on Gunpla Battle, builders and virtual Gunpla competition systems.',
    'published'
  ),
  (
    'sd-gundam-worlds',
    'SD Gundam Worlds',
    'SD',
    'A catalog grouping for SD Gundam settings, including fantasy, historical and cross-world adventures.',
    'published'
  ),
  (
    'standalone-alternative',
    'Standalone and Alternative Worlds',
    'ALT',
    'A catalog grouping for Gundam works that do not belong cleanly to one of the primary animated timelines.',
    'published'
  )
on conflict (slug) do update
set
  name = excluded.name,
  code = excluded.code,
  description = excluded.description,
  status = excluded.status,
  updated_at = now();

commit;