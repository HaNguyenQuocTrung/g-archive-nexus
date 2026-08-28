import Link from "next/link";
import { ArrowLeft, ChevronRight, Radio } from "lucide-react";

import { getTimelinesFromDatabase } from "@/lib/data/getTimelinesFromDatabase";

export const metadata = {
  title: "Timelines",
  description: "Explore the major timelines of the Gundam multiverse.",
};

export default async function TimelinesPage() {
  const timelines = await getTimelinesFromDatabase();

  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100">
      <div className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500 hover:text-cyan-400"
          >
            <ArrowLeft size={15} />
            Return to terminal
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
            <Radio size={15} className="animate-pulse" />
            Chronology database online
          </div>

          <p className="mt-8 font-mono text-sm uppercase tracking-[0.3em] text-amber-400">
            Sector 01 // Timeline Archive
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase md:text-7xl">
            Timeline Matrix
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Access historical records from the major universes and eras of the
            Gundam multiverse.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {timelines.map((timeline, index) => (
              <Link
                key={timeline.id}
                href={`/timelines/${timeline.id}`}
                className="group border border-slate-800 bg-[#0F172A]/90 p-8 transition hover:border-cyan-400/60"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                      Record {String(index + 1).padStart(2, "0")}
                    </p>

                    <p className="mt-5 font-mono text-6xl font-bold text-cyan-400">
                      {timeline.code}
                    </p>
                  </div>

                  <ChevronRight
                    size={26}
                    className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                  />
                </div>

                <h2 className="mt-8 text-2xl font-bold uppercase">
                  {timeline.name}
                </h2>

                <p className="mt-4 line-clamp-3 leading-7 text-slate-400">
                  {timeline.description}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5 font-mono text-[10px] uppercase tracking-wider">
                  <span className="text-emerald-400">
                    ● {timeline.status}
                  </span>

                  <span className="text-slate-500">
                    {timeline.seriesIds.length} series registered
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}