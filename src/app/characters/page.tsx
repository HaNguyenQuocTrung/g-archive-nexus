import Link from "next/link";
import { ArrowLeft, ChevronRight, Radio, UserRound } from "lucide-react";

import { getCharactersFromDatabase } from "@/lib/data/getCharactersFromDatabase";
import { getAllSeriesFromDatabase } from "@/lib/data/getSeriesFromDatabase";

export const metadata = {
  title: "Pilot Archive",
  description:
    "Browse pilots, commanders and notable characters from Gundam history.",
};

export default async function CharactersPage() {
  const [characters, seriesRecords] = await Promise.all([
    getCharactersFromDatabase(),
    getAllSeriesFromDatabase(),
  ]);

  const seriesMap = new Map(seriesRecords.map((series) => [series.id, series]));

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
            Personnel database online
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-amber-400">
            Sector 03 // Personnel Records
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase md:text-7xl">
            Pilot Archive
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Access personnel records, affiliations, identities and Mobile Suit
            combat histories.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {characters.map((character, index) => {
              const currentEra = character.eras[0];
              const series = currentEra
                ? seriesMap.get(currentEra.seriesId)
                : undefined;

              return (
                <Link
                  key={character.id}
                  href={`/characters/${character.id}`}
                  className="group grid grid-cols-[100px_1fr_auto] gap-6 border border-slate-800 bg-[#0F172A]/90 p-6 transition hover:border-cyan-400/60"
                >
                  <div className="flex h-28 items-center justify-center border border-slate-700 bg-[#070A0F]">
                    <UserRound
                      size={38}
                      strokeWidth={1.2}
                      className="text-slate-600 group-hover:text-cyan-400"
                    />
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Personnel {String(index + 1).padStart(3, "0")}
                    </p>

                    <h2 className="mt-3 text-xl font-bold uppercase group-hover:text-cyan-400">
                      {character.canonicalName}
                    </h2>

                    {character.japaneseName && (
                      <p className="mt-1 text-sm text-slate-500">
                        {character.japaneseName}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="border border-cyan-400/30 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-cyan-400">
                        {currentEra?.faction ?? "Unknown faction"}{" "}
                      </span>

                      <span className="border border-slate-700 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-slate-400">
                        {series?.inUniverseYear ?? "Unknown era"}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    size={22}
                    className="self-center text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
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
