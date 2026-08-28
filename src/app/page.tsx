import MobileNavigation from "@/components/layout/MobileNavigation";
import Link from "next/link";
import { ChevronRight, Database, Radio, Search, Shield } from "lucide-react";

const timelines = [
  {
    code: "UC",
    name: "Universal Century",
    status: "Archive Online",
    href: "/timelines/universal-century",
  },
  {
    code: "CE",
    name: "Cosmic Era",
    status: "Archive Online",
    href: "/timelines/cosmic-era",
  },
  {
    code: "AD",
    name: "Anno Domini",
    status: "Data Pending",
    href: "/timelines",
  },
  {
    code: "AS",
    name: "Ad Stella",
    status: "Data Pending",
    href: "/timelines",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100">
      <header className="relative border-b border-slate-800 bg-[#070A0F]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="border border-cyan-400/50 p-2 text-cyan-400">
              <Database size={22} />
            </div>

            <div>
              <p className="font-mono text-lg font-bold tracking-[0.2em]">
                G-ARCHIVE NEXUS
              </p>
              <p className="font-mono text-[10px] tracking-[0.25em] text-cyan-400">
                MOBILE SUIT INTELLIGENCE DATABASE
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-wider text-slate-400 md:flex">
            <Link href="/timelines" className="hover:text-cyan-400">
              Timelines
            </Link>
            <Link href="/series" className="hover:text-cyan-400">
              Series
            </Link>
            <Link href="/mobile-suits" className="hover:text-cyan-400">
              Mobile Suits
            </Link>
            <Link href="/characters" className="hover:text-cyan-400">
              Pilots
            </Link>
          </nav>

          <MobileNavigation />
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
              <Radio size={16} className="animate-pulse" />
              System online // Archive access granted
            </div>

            <p className="font-mono text-sm uppercase tracking-[0.3em] text-amber-400">
              GAN-01 // Central Archive
            </p>

            <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">
              Every timeline.
              <span className="block text-cyan-400">Every mobile suit.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              Explore the histories, pilots, specifications, armaments and
              variants of Mobile Suits across the Gundam multiverse.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/mobile-suits"
                className="flex items-center gap-3 bg-cyan-400 px-6 py-4 font-mono text-sm font-bold uppercase tracking-wider text-slate-950 transition hover:bg-cyan-300"
              >
                Access database
                <ChevronRight size={18} />
              </Link>

              <Link
                href="/timelines"
                className="flex items-center gap-3 border border-slate-600 px-6 py-4 font-mono text-sm uppercase tracking-wider text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
              >
                Explore timelines
              </Link>
            </div>
          </div>

          <div className="border border-cyan-400/20 bg-[#0F172A]/80 p-1">
            <div className="border border-slate-800 p-7">
              <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400">
                    Quick archive search
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Unit, pilot or model number
                  </p>
                </div>

                <Search className="text-cyan-400" />
              </div>

              <form action="/search" className="mt-6">
                <input
                  name="q"
                  type="search"
                  placeholder="EX: RX-78-2, AMURO RAY..."
                  className="w-full border border-slate-700 bg-[#070A0F] px-4 py-4 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                />

                <button
                  type="submit"
                  className="mt-4 w-full border border-cyan-400/50 py-3 font-mono text-xs uppercase tracking-[0.25em] text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950"
                >
                  Execute search
                </button>
              </form>

              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-800 pt-6 text-center">
                <div>
                  <p className="font-mono text-xl text-white">02</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                    Timelines
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xl text-white">04</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                    Units
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xl text-white">04</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                    Pilots
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
              Sector 01 // Chronology
            </p>
            <h2 className="mt-3 text-3xl font-bold uppercase">
              Timeline Matrix
            </h2>
          </div>

          <Link
            href="/timelines"
            className="hidden font-mono text-xs uppercase tracking-wider text-slate-400 hover:text-cyan-400 sm:block"
          >
            View all records →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {timelines.map((timeline) => (
            <Link
              key={timeline.code}
              href={timeline.href}
              className="group border border-slate-800 bg-[#0F172A] p-6 transition hover:border-cyan-400/60"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-4xl font-bold text-slate-200 group-hover:text-cyan-400">
                  {timeline.code}
                </span>
                <Shield size={18} className="text-slate-600" />
              </div>

              <h3 className="mt-8 font-semibold uppercase tracking-wide">
                {timeline.name}
              </h3>

              <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                {timeline.status}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 font-mono text-xs uppercase tracking-wider text-slate-600 sm:flex-row sm:justify-between">
          <p>G-Archive Nexus // Fan-made archive</p>
          <p>Not affiliated with Bandai Namco or Sunrise</p>
        </div>
      </footer>
    </main>
  );
}
