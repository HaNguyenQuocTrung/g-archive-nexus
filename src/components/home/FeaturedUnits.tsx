import Link from "next/link";
import { ChevronRight, Cpu } from "lucide-react";
import type { MobileSuit, Timeline } from "@/types";

interface FeaturedUnitsProps {
  units: MobileSuit[];
  timelines: Timeline[];
}

export default function FeaturedUnits({
  units,
  timelines,
}: FeaturedUnitsProps) {
  const featuredUnits = units.slice(0, 4);

  const timelineMap = new Map(
    timelines.map((timeline) => [timeline.id, timeline]),
  );

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
            Sector 02 // Featured Records
          </p>

          <h2 className="mt-3 text-3xl font-bold uppercase">
            Featured Mobile Suits
          </h2>
        </div>

        <Link
          href="/mobile-suits"
          className={[
            "hidden font-mono text-xs uppercase",
            "tracking-wider text-slate-400",
            "hover:text-cyan-400 sm:block",
          ].join(" ")}
        >
          View database →
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {featuredUnits.map((unit, index) => {
          const timeline = timelineMap.get(unit.timelineId);

          return (
            <Link
              key={unit.id}
              href={`/mobile-suits/${unit.id}`}
              className={[
                "group overflow-hidden",
                "border border-slate-800",
                "bg-[#0F172A]",
                "transition",
                "hover:border-cyan-400/60",
              ].join(" ")}
            >
              <div
                className={[
                  "relative flex min-h-52",
                  "items-center justify-center",
                  "border-b border-slate-800",
                  "bg-[#070A0F]",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute left-4 top-4",
                    "font-mono text-[9px]",
                    "uppercase tracking-wider",
                    "text-slate-600",
                  ].join(" ")}
                >
                  Unit {String(index + 1).padStart(3, "0")}
                </span>

                <span
                  className={[
                    "absolute right-4 top-4",
                    "font-mono text-xs",
                    "text-cyan-400",
                  ].join(" ")}
                >
                  {timeline?.code ?? "N/A"}
                </span>

                <Cpu
                  size={62}
                  strokeWidth={0.8}
                  className={[
                    "text-slate-700 transition",
                    "group-hover:text-cyan-400",
                  ].join(" ")}
                />
              </div>

              <div className="p-5">
                <p
                  className={[
                    "font-mono text-xs",
                    "tracking-[0.2em]",
                    "text-amber-400",
                  ].join(" ")}
                >
                  {unit.modelNumber}
                </p>

                <div
                  className={[
                    "mt-3 flex items-start",
                    "justify-between gap-4",
                  ].join(" ")}
                >
                  <h3
                    className={[
                      "font-bold uppercase",
                      "group-hover:text-cyan-400",
                    ].join(" ")}
                  >
                    {unit.baseName}
                  </h3>

                  <ChevronRight
                    size={18}
                    className={[
                      "shrink-0 text-slate-600",
                      "transition",
                      "group-hover:translate-x-1",
                      "group-hover:text-cyan-400",
                    ].join(" ")}
                  />
                </div>

                <p
                  className={[
                    "mt-3 font-mono text-[9px]",
                    "uppercase tracking-wider",
                    "text-slate-600",
                  ].join(" ")}
                >
                  {unit.variants.length} configuration
                  {unit.variants.length === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
