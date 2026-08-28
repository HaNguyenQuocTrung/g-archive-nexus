import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Cpu,
  Radio,
} from "lucide-react";

import { getMobileSuits } from "@/lib/data/getMobileSuits";
import { getTimelineById } from "@/lib/data/getTimelines";

export const metadata = {
  title: "Mobile Suit Database",
  description:
    "Browse Mobile Suit specifications, armaments, systems and variants.",
};

export default function MobileSuitsPage() {
  const mobileSuits = getMobileSuits();

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
            Unit database online
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-amber-400">
            Sector 04 // Mechanical Records
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase md:text-7xl">
            Mobile Suit Database
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Access Mobile Suit specifications, armaments, combat systems and
            configuration records.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {mobileSuits.map((mobileSuit, index) => {
              const timeline = getTimelineById(
                mobileSuit.timelineId,
              );

              const primaryVariant = mobileSuit.variants[0];

              return (
                <Link
                  key={mobileSuit.id}
                  href={`/mobile-suits/${mobileSuit.id}`}
                  className="group overflow-hidden border border-slate-800 bg-[#0F172A]/90 transition hover:border-cyan-400/60"
                >
                  <div className="relative flex min-h-64 items-center justify-center border-b border-slate-800 bg-[#070A0F]">
                    <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                      Unit {String(index + 1).padStart(3, "0")}
                    </div>

                    <div className="text-center">
                      <Cpu
                        size={72}
                        strokeWidth={0.9}
                        className="mx-auto text-slate-700 transition group-hover:text-cyan-400"
                      />

                      <p className="mt-5 font-mono text-xs uppercase tracking-[0.25em] text-slate-600">
                        Visual data pending
                      </p>
                    </div>

                    <span className="absolute right-5 top-5 border border-cyan-400/30 px-3 py-1 font-mono text-xs text-cyan-400">
                      {timeline?.code ?? "N/A"}
                    </span>
                  </div>

                  <div className="p-7">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="font-mono text-sm font-bold tracking-[0.2em] text-amber-400">
                          {mobileSuit.modelNumber}
                        </p>

                        <h2 className="mt-3 text-2xl font-bold uppercase group-hover:text-cyan-400">
                          {mobileSuit.baseName}
                        </h2>

                        <p className="mt-3 text-sm text-slate-500">
                          {mobileSuit.manufacturer}
                        </p>
                      </div>

                      <ChevronRight
                        size={24}
                        className="mt-2 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                      />
                    </div>

                    <p className="mt-6 line-clamp-2 leading-7 text-slate-400">
                      {primaryVariant.description}
                    </p>

                    <div className="mt-7 grid grid-cols-3 gap-3 border-t border-slate-800 pt-5 text-center">
                      <DatabaseValue
                        label="Forms"
                        value={mobileSuit.variants.length}
                      />

                      <DatabaseValue
                        label="Weapons"
                        value={primaryVariant.armaments.length}
                      />

                      <DatabaseValue
                        label="Systems"
                        value={primaryVariant.specialSystems.length}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

interface DatabaseValueProps {
  label: string;
  value: number;
}

function DatabaseValue({
  label,
  value,
}: DatabaseValueProps) {
  return (
    <div>
      <p className="font-mono text-xl text-slate-200">
        {String(value).padStart(2, "0")}
      </p>

      <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-slate-600">
        {label}
      </p>
    </div>
  );
}