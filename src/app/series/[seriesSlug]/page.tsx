import SeriesConnectionsPanel from "@/components/series/SeriesConnectionsPanel";
import { getSeriesConnectionsFromDatabase } from "@/lib/data/getSeriesConnectionsFromDatabase";
import SeriesArchiveTabs from "@/components/series/SeriesArchiveTabs";
import { getCharactersFromDatabase } from "@/lib/data/getCharactersFromDatabase";
import { getMobileSuitsFromDatabase } from "@/lib/data/getMobileSuitsFromDatabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clapperboard,
  Clock3,
  ListVideo,
  Radio,
} from "lucide-react";

import {
  getAllSeriesFromDatabase,
  getSeriesByIdFromDatabase,
} from "@/lib/data/getSeriesFromDatabase";
import { getTimelineByIdFromDatabase } from "@/lib/data/getTimelinesFromDatabase";

interface SeriesDetailPageProps {
  params: Promise<{
    seriesSlug: string;
  }>;
}

export async function generateStaticParams() {
  const seriesRecords = await getAllSeriesFromDatabase();

  return seriesRecords.map((series) => ({
    seriesSlug: series.id,
  }));
}

export async function generateMetadata({ params }: SeriesDetailPageProps) {
  const { seriesSlug } = await params;
  const series = await getSeriesByIdFromDatabase(seriesSlug);

  if (!series) {
    return {
      title: "Series Not Found",
    };
  }

  return {
    title: series.titles.en,
    description: series.synopsis,
  };
}

export default async function SeriesDetailPage({
  params,
}: SeriesDetailPageProps) {
  const { seriesSlug } = await params;
  const series = await getSeriesByIdFromDatabase(seriesSlug);

  if (!series) {
    notFound();
  }

  const [timeline, characters, mobileSuits, connections] = await Promise.all([
    getTimelineByIdFromDatabase(series.timelineId),
    getCharactersFromDatabase(),
    getMobileSuitsFromDatabase(),
    getSeriesConnectionsFromDatabase(series.id),
  ]);

  const characterMap = new Map(
    characters.map((character) => [character.id, character]),
  );

  const mobileSuitMap = new Map(
    mobileSuits.map((mobileSuit) => [mobileSuit.id, mobileSuit]),
  );
  const castRecords = series.characterIds.flatMap((characterId) => {
    const character = characterMap.get(characterId);
    if (!character) {
      return [];
    }

    const era = character.eras.find((item) => item.seriesId === series.id);

    return [
      {
        id: character.id,
        title: character.canonicalName,
        subtitle: era?.faction ?? "Faction unknown",
        href: `/characters/${character.id}`,
      },
    ];
  });

  const mobileSuitRecords = series.mobileSuitIds.flatMap((mobileSuitId) => {
    const mobileSuit = mobileSuitMap.get(mobileSuitId);
    if (!mobileSuit) {
      return [];
    }

    return [
      {
        id: mobileSuit.id,
        title: mobileSuit.baseName,
        subtitle: mobileSuit.modelNumber,
        href: `/mobile-suits/${mobileSuit.id}`,
      },
    ];
  });
  const movieMediaTypes: string[] = [
    "movie",
    "compilation-movie",
    "short-film",
    "special",
    "promotional-animation",
    "live-action-movie",
    "vr-experience",
    "motion-comic",
    "music-video",
    "attraction-film",
  ];

  const belongsToMovieArchive = movieMediaTypes.includes(series.mediaType);

  const archiveHref = belongsToMovieArchive ? "/movies" : "/series";

  const archiveLabel = belongsToMovieArchive
    ? "Movie archive"
    : "Series archive";

  const releaseValue =
    series.releaseDate ??
    (series.releaseYear ? String(series.releaseYear) : "Not registered");
  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
            href={archiveHref}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500 hover:text-cyan-400"
          >
            <ArrowLeft size={15} />
            {archiveLabel}{" "}
          </Link>

          <div
            className={[
              "flex items-center gap-2 font-mono text-[10px]",
              "uppercase tracking-wider",
              series.catalogStatus === "verified"
                ? "text-emerald-400"
                : "text-amber-400",
            ].join(" ")}
          >
            <Radio size={13} className="animate-pulse" />
            Catalog // {series.catalogStatus.replaceAll("_", " ")}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[320px_1fr]">
          <div className="flex min-h-[440px] items-center justify-center border border-cyan-400/30 bg-[#0F172A]/90">
            <div className="text-center">
              <Clapperboard
                size={58}
                strokeWidth={1.2}
                className="mx-auto text-cyan-400"
              />

              <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                Poster data pending
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-cyan-400/30 px-3 py-1 font-mono text-xs uppercase tracking-wider text-cyan-400">
                {timeline?.code ?? "Unknown timeline"}
              </span>

              <span className="font-mono text-xs uppercase tracking-wider text-amber-400">
                {series.inUniverseYear}
              </span>

              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400">
                ● {series.status}
              </span>
            </div>

            <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
              Series Record // {series.id}
            </p>

            <h1 className="mt-4 text-4xl font-black uppercase leading-tight md:text-6xl">
              {series.titles.en}
            </h1>

            {series.titles.ja && (
              <p className="mt-4 text-xl text-slate-500">{series.titles.ja}</p>
            )}

            <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-300">
              {series.synopsis}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <InfoPanel label="Timeline" value={timeline?.name ?? "Unknown"} />

              <InfoPanel
                label="Release"
                value={releaseValue}
                icon={<CalendarDays size={15} />}
              />

              <InfoPanel
                label="Media type"
                value={series.mediaType.replaceAll("-", " ")}
              />

              {series.episodeCount !== undefined && (
                <InfoPanel
                  label="Episode count"
                  value={String(series.episodeCount)}
                  icon={<ListVideo size={15} />}
                />
              )}

              {series.runtimeMinutes !== undefined && (
                <InfoPanel
                  label="Runtime"
                  value={`${series.runtimeMinutes} minutes`}
                  icon={<Clock3 size={15} />}
                />
              )}

              <InfoPanel
                label="Director"
                value={series.director ?? "Not registered"}
              />

              <InfoPanel
                label="Catalog status"
                value={series.catalogStatus.replaceAll("_", " ")}
              />
            </div>
          </div>
        </div>
      </section>
      <SeriesConnectionsPanel
        relations={connections.relations}
        sources={connections.sources}
      />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
          Connected Records
        </p>

        <h2 className="mt-3 text-3xl font-bold uppercase">
          Cast and Mobile Suits
        </h2>

        <div className="mt-10">
          <SeriesArchiveTabs
            cast={castRecords}
            mobileSuits={mobileSuitRecords}
          />
        </div>
      </section>
    </main>
  );
}

interface InfoPanelProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function InfoPanel({ label, value, icon }: InfoPanelProps) {
  return (
    <div className="border border-slate-800 bg-[#0F172A] p-5">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </div>

      <p className="mt-3 capitalize text-slate-200">{value}</p>
    </div>
  );
}
