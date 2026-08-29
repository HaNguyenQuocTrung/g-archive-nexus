import Link from "next/link";
import { ArrowLeft, Radio, Search } from "lucide-react";

import QuickSearch from "@/components/search/QuickSearch";
import { buildSearchIndex } from "@/lib/search/searchArchive";

export const metadata = {
  title: "Archive Search",
  description:
    "Search timelines, series, pilots, Mobile Suits, weapons, and systems.",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const initialQuery =
    typeof params.q === "string" ? params.q : "";

const records = await buildSearchIndex();
  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center 
justify-between px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs 
uppercase tracking-wider text-slate-500 hover:text-cyan-400"
          >
            <ArrowLeft size={15} />
            Return to terminal
          </Link>

          <div className="flex items-center gap-2 font-mono text-[10px] 
uppercase tracking-wider text-emerald-400">
            <Radio size={13} className="animate-pulse" />
            Search system online
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b 
border-slate-800">
        <div className="absolute inset-0 
bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] 
bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-center gap-3 font-mono text-xs 
uppercase tracking-[0.25em] text-cyan-400">
            <Search size={16} />
            Global archive retrieval
          </div>

          <p className="mt-8 font-mono text-sm uppercase tracking-[0.3em] 
text-amber-400">
            Sector 05 // Search Terminal
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase md:text-7xl">
            Archive Search
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Search by Mobile Suit name, model number, pilot, faction,
            timeline, weapon or special combat system.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <QuickSearch
          records={records}
          initialQuery={initialQuery}
        />
      </section>
    </main>
  );
}
