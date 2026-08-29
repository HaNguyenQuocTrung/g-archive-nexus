import Link from "next/link";
import { ChevronRight, UserRound } from "lucide-react";
import type { Character, Series } from "@/types";

interface FeaturedPilotsProps {
  pilots: Character[];
  seriesRecords: Series[];
}

export default function FeaturedPilots({
  pilots,
  seriesRecords,
}: FeaturedPilotsProps) {
  const featuredPilots = pilots.slice(0, 4);

  const seriesMap = new Map(seriesRecords.map((series) => [series.id, series]));

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div
        className={["mb-10 flex items-end", "justify-between gap-6"].join(" ")}
      >
        <div>
          <p
            className={[
              "font-mono text-xs uppercase",
              "tracking-[0.3em] text-amber-400",
            ].join(" ")}
          >
            Sector 03 // Personnel Records
          </p>

          <h2 className="mt-3 text-3xl font-bold uppercase">Featured Pilots</h2>
        </div>

        <Link
          href="/characters"
          className={[
            "hidden font-mono text-xs uppercase",
            "tracking-wider text-slate-400",
            "hover:text-cyan-400 sm:block",
          ].join(" ")}
        >
          View pilot archive →
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {featuredPilots.map((pilot, index) => {
          const era = pilot.eras[0];

          const series = era ? seriesMap.get(era.seriesId) : undefined;

          return (
            <Link
              key={pilot.id}
              href={`/characters/${pilot.id}`}
              className={[
                "group grid grid-cols-[90px_1fr_auto]",
                "gap-5 border border-slate-800",
                "bg-[#0F172A] p-5 transition",
                "hover:border-cyan-400/60",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-24 items-center",
                  "justify-center",
                  "border border-slate-700",
                  "bg-[#070A0F]",
                ].join(" ")}
              >
                <UserRound
                  size={35}
                  strokeWidth={1}
                  className={[
                    "text-slate-600 transition",
                    "group-hover:text-cyan-400",
                  ].join(" ")}
                />
              </div>

              <div className="min-w-0 self-center">
                <p
                  className={[
                    "font-mono text-[9px]",
                    "uppercase tracking-wider",
                    "text-slate-600",
                  ].join(" ")}
                >
                  Pilot {String(index + 1).padStart(3, "0")}
                </p>

                <h3
                  className={[
                    "mt-2 font-bold uppercase",
                    "group-hover:text-cyan-400",
                  ].join(" ")}
                >
                  {pilot.canonicalName}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {era?.faction ?? "Unknown faction"}
                </p>

                <p
                  className={[
                    "mt-2 truncate font-mono",
                    "text-[9px] uppercase",
                    "tracking-wider text-amber-400",
                  ].join(" ")}
                >
                  {series?.inUniverseYear ??
                    era?.seriesId ??
                    "Unknown era"}{" "}
                </p>
              </div>

              <ChevronRight
                size={19}
                className={[
                  "self-center text-slate-600",
                  "transition",
                  "group-hover:translate-x-1",
                  "group-hover:text-cyan-400",
                ].join(" ")}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
