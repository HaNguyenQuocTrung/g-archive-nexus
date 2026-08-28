import Link from "next/link";
import { ChevronRight, Clapperboard } from "lucide-react";

import { getSeriesByTimelineId } from "@/lib/data/getSeries";

interface TimelineSeriesRecordsProps {
  timelineId: string;
}

export default function TimelineSeriesRecords({
  timelineId,
}: TimelineSeriesRecordsProps) {
  const seriesRecords =
    getSeriesByTimelineId(timelineId);

  return (
    <section className="mt-12">
      <p
        className={[
          "font-mono text-xs uppercase",
          "tracking-[0.25em] text-amber-400",
        ].join(" ")}
      >
        Connected Series Records
      </p>

      <div className="mt-5 space-y-4">
        {seriesRecords.map((series) => (
          <Link
            key={series.id}
            href={`/series/${series.id}`}
            className={[
              "group flex items-center gap-5",
              "border border-slate-800",
              "bg-[#0F172A] p-5 transition",
              "hover:border-cyan-400/60",
            ].join(" ")}
          >
            <div
              className={[
                "flex h-16 w-16 shrink-0",
                "items-center justify-center",
                "border border-slate-700",
                "bg-[#070A0F]",
              ].join(" ")}
            >
              <Clapperboard
                size={25}
                className="text-cyan-400"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={[
                  "font-mono text-[10px]",
                  "uppercase tracking-wider",
                  "text-amber-400",
                ].join(" ")}
              >
                {series.inUniverseYear}
              </p>

              <h2
                className={[
                  "mt-2 truncate font-bold uppercase",
                  "group-hover:text-cyan-400",
                ].join(" ")}
              >
                {series.titles.en}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Released {series.releaseYear}
              </p>
            </div>

            <ChevronRight
              size={21}
              className={[
                "text-slate-600 transition",
                "group-hover:translate-x-1",
                "group-hover:text-cyan-400",
              ].join(" ")}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
