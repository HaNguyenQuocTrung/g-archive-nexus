import Link from "next/link";
import { ArrowLeft, Film, Radio } from "lucide-react";

import WorkArchiveList from "@/components/series/WorkArchiveList";
import { getAllSeriesFromDatabase } from "@/lib/data/getSeriesFromDatabase";
import { getTimelinesFromDatabase } from "@/lib/data/getTimelinesFromDatabase";
import type { MediaType } from "@/types";

export const metadata = {
  title: "Movie Archive",
  description:
    "Browse Gundam movies, compilation films, short films and special-format productions.",
};

const movieMediaTypes = new Set<MediaType>([
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
]);

export default async function MoviesPage() {
  const [allWorks, timelines] = await Promise.all([
    getAllSeriesFromDatabase(),
    getTimelinesFromDatabase(),
  ]);

  const movieRecords = allWorks.filter((work) =>
    movieMediaTypes.has(work.mediaType),
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
            Movie database online
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-amber-400">
            Sector 03 // Theatrical Records
          </p>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4">
                <Film size={38} className="text-cyan-400" />

                <h1 className="text-5xl font-black uppercase md:text-7xl">
                  Movie Archive
                </h1>
              </div>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
                Browse theatrical movies, compilation films, short films,
                special productions, live-action works and immersive experiences
                from the Gundam archive.
              </p>
            </div>

            <div className="border border-cyan-400/30 bg-[#0F172A]/90 px-6 py-4 text-right">
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                Registered movies
              </p>

              <p className="mt-2 font-mono text-3xl text-cyan-400">
                {String(movieRecords.length).padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="mt-14">
            <WorkArchiveList
              records={movieRecords}
              timelines={timelines}
              emptyMessage="No movie records registered"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
