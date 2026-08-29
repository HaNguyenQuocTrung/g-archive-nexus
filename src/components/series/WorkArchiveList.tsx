import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clapperboard,
  Clock3,
  ListVideo,
} from "lucide-react";

import type { Series, Timeline } from "@/types";

interface WorkArchiveListProps {
  records: Series[];
  timelines: Timeline[];
  emptyMessage: string;
}

function formatMediaType(mediaType: Series["mediaType"]): string {
  return mediaType.replaceAll("-", " ");
}

export default function WorkArchiveList({
  records,
  timelines,
  emptyMessage,
}: WorkArchiveListProps) {
  const timelineMap = new Map(
    timelines.map((timeline) => [timeline.id, timeline]),
  );

  if (records.length === 0) {
    return (
      <div className="border border-slate-800 bg-[#0F172A]/90 p-10 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {records.map((record, index) => {
        const timeline = timelineMap.get(record.timelineId);

        return (
          <Link
            key={record.id}
            href={`/series/${record.id}`}
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

                <span className="border border-slate-700 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  {formatMediaType(record.mediaType)}
                </span>

                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {record.inUniverseYear}
                </span>

                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  ● {record.status}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold uppercase group-hover:text-cyan-400">
                {record.titles.en}
              </h2>

              {record.titles.ja && (
                <p className="mt-2 text-sm text-slate-500">
                  {record.titles.ja}
                </p>
              )}

              <p className="mt-5 line-clamp-2 max-w-3xl leading-7 text-slate-400">
                {record.synopsis}
              </p>

              <div className="mt-5 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                <span className="flex items-center gap-2">
                  <CalendarDays size={13} />
                  Released {record.releaseYear || "Unknown"}
                </span>

                {record.episodeCount !== undefined && (
                  <span className="flex items-center gap-2">
                    <ListVideo size={13} />
                    {record.episodeCount} episodes
                  </span>
                )}

                {record.runtimeMinutes !== undefined && (
                  <span className="flex items-center gap-2">
                    <Clock3 size={13} />
                    {record.runtimeMinutes} minutes
                  </span>
                )}

                <span>{record.characterIds.length} characters</span>
                <span>{record.mobileSuitIds.length} units</span>
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
  );
}