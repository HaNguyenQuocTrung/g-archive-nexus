import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clapperboard,
  Radio,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  getAllSeries,
  getSeriesById,
} from "@/lib/data/getSeries";
import { getTimelineById } from "@/lib/data/getTimelines";

interface SeriesDetailPageProps {
  params: Promise<{
    seriesSlug: string;
  }>;
}

export function generateStaticParams() {
  return getAllSeries().map((series) => ({
    seriesSlug: series.id,
  }));
}

export async function generateMetadata({
  params,
}: SeriesDetailPageProps) {
  const { seriesSlug } = await params;
  const series = getSeriesById(seriesSlug);

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
  const series = getSeriesById(seriesSlug);

  if (!series) {
    notFound();
  }

  const timeline = getTimelineById(series.timelineId);

  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
            href="/series"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500 hover:text-cyan-400"
          >
            <ArrowLeft size={15} />
            Series archive
          </Link>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            <Radio size={13} className="animate-pulse" />
            Record verified
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
              <p className="mt-4 text-xl text-slate-500">
                {series.titles.ja}
              </p>
            )}

            <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-300">
              {series.synopsis}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <InfoPanel
                label="Timeline"
                value={timeline?.name ?? "Unknown"}
              />

              <InfoPanel
                label="Release"
                value={String(series.releaseYear)}
                icon={<CalendarDays size={15} />}
              />

              <InfoPanel
                label="Media type"
                value={series.mediaType.replace("-", " ")}
              />

              <InfoPanel
                label="Director"
                value={series.director ?? "Not registered"}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
          Connected Records
        </p>

        <h2 className="mt-3 text-3xl font-bold uppercase">
          Cast and Mobile Suits
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ArchiveGroup
            title="Character roster"
            count={series.characterIds.length}
            icon={<UserRound className="text-cyan-400" />}
            records={series.characterIds}
            basePath="/characters"
          />

          <ArchiveGroup
            title="Mobile Suit roster"
            count={series.mobileSuitIds.length}
            icon={<Wrench className="text-amber-400" />}
            records={series.mobileSuitIds}
            basePath="/mobile-suits"
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

interface ArchiveGroupProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  records: string[];
  basePath: string;
}

function ArchiveGroup({
  title,
  count,
  icon,
  records,
  basePath,
}: ArchiveGroupProps) {
  return (
    <section className="border border-slate-800 bg-[#0F172A] p-7">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          {icon}

          <h3 className="font-bold uppercase">{title}</h3>
        </div>

        <span className="font-mono text-xs text-slate-500">
          {String(count).padStart(2, "0")} records
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {records.map((record) => (
          <Link
            key={record}
            href={`${basePath}/${record}`}
            className="block border border-slate-800 bg-[#070A0F] px-4 py-4 font-mono text-sm uppercase tracking-wider text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-400"
          >
            {record.replaceAll("-", " ")}
          </Link>
        ))}
      </div>
    </section>
  );
}