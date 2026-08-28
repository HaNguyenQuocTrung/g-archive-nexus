begin;

grant usage on schema public
to anon, authenticated, service_role;

grant select on table
  public.timelines,
  public.series,
  public.characters,
  public.character_eras,
  public.mobile_suits,
  public.mobile_suit_variants,
  public.weapons,
  public.mobile_suit_systems,
  public.pilot_assignments,
  public.series_mobile_suits,
  public.series_characters
to anon, authenticated;

grant insert, update, delete on table
  public.timelines,
  public.series,
  public.characters,
  public.character_eras,
  public.mobile_suits,
  public.mobile_suit_variants,
  public.weapons,
  public.mobile_suit_systems,
  public.pilot_assignments,
  public.series_mobile_suits,
  public.series_characters
to authenticated;

grant all privileges on all tables in schema public
to service_role;

grant all privileges on all sequences in schema public
to service_role;

alter default privileges in schema public
grant all privileges on tables to service_role;

alter default privileges in schema public
grant all privileges on sequences to service_role;

commit;