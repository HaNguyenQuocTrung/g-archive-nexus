import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clapperboard,
  Radio,
} from "lucide-react";

import { getAllSeriesFromDatabase } from "@/lib/data/getSeriesFromDatabase";
import { getTimelinesFromDatabase } from "@/lib/data/getTimelinesFromDatabase";

export const metadata = {
  title: "Series Archive",
  description: "Browse Gundam television series, movies, OVAs and manga.",
};

export default async function SeriesPage() {
  const [seriesRecords, timelines] = await Promise.all([
    getAllSeriesFromDatabase(),
    getTimelinesFromDatabase(),
  ]);

  const timelineMap = new Map(
    timelines.map((timeline) => [timeline.id, timeline]),
  );

  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500 hover:text-cyan-400"
          >
            <ArrowLeft size={15} />
            Return to terminal
          </Link>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            <Radio size={13} className="animate-pulse" />
            Series database online
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-amber-400">
            Sector 02 // Media Records
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase md:text-7xl">
            Series Archive
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Browse animated productions and historical records from across
            multiple Gundam timelines.
          </p>

          <div className="mt-14 space-y-6">
            {seriesRecords.map((series, index) => {
              const timeline = timelineMap.get(series.timelineId);

              return (
                <Link
                  key={series.id}
                  href={`/series/${series.id}`}
                  className="group grid gap-8 border border-slate-800 bg-[#0F172A]/90 p-7 transition hover:border-cyan-400/60 md:grid-cols-[150px_1fr_auto] md:items-center"
                >
                  <div className="flex h-36 items-center justify-center border border-slate-700 bg-[#070A0F]">
                    <div className="text-center">
                      <Clapperboard
                        size={30}
                        className="mx-auto text-cyan-400"
                      />

                      <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                        Record {String(index + 1).padStart(2, "0")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="border border-cyan-400/30 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                        {timeline?.code ?? "Unknown"}
                      </span>

                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        {series.inUniverseYear}
                      </span>

                      <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                        ● {series.status}
                      </span>
                    </div>

                    <h2 className="mt-5 text-2xl font-bold uppercase group-hover:text-cyan-400">
                      {series.titles.en}
                    </h2>

                    {series.titles.ja && (
                      <p className="mt-2 text-sm text-slate-500">
                        {series.titles.ja}
                      </p>
                    )}

                    <p className="mt-5 line-clamp-2 max-w-3xl leading-7 text-slate-400">
                      {series.synopsis}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={13} />
                        Released {series.releaseYear}
                      </span>

                      <span>{series.characterIds.length} characters</span>
                      <span>{series.mobileSuitIds.length} units</span>
                    </div>
                  </div>

                  <ChevronRight
                    size={28}
                    className="hidden text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400 md:block"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}