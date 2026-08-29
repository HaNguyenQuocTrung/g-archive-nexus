import Link from "next/link";
import { ArrowUpRight, BookOpen, ChevronRight, GitBranch } from "lucide-react";

import type {
  RelatedWork,
  SeriesSource,
} from "@/lib/data/getSeriesConnectionsFromDatabase";

interface SeriesConnectionsPanelProps {
  relations: RelatedWork[];
  sources: SeriesSource[];
}

function formatMediaType(mediaType: RelatedWork["mediaType"]): string {
  return mediaType?.replaceAll("-", " ") ?? "unknown format";
}

function formatRelation(relation: RelatedWork): string {
  if (relation.direction === "incoming") {
    if (relation.relationType === "compilation") {
      return "compilation of";
    }

    if (relation.relationType === "remake") {
      return "original version";
    }

    if (relation.relationType === "alternate-version") {
      return "original version";
    }

    if (relation.relationType === "side-story") {
      return "parent work";
    }
  }

  return relation.relationType.replaceAll("-", " ");
}

export default function SeriesConnectionsPanel({
  relations,
  sources,
}: SeriesConnectionsPanelProps) {
  if (relations.length === 0 && sources.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-slate-800 bg-[#090D14]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-2">
        <div className="border border-slate-800 bg-[#0F172A] p-7">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <GitBranch size={18} className="text-cyan-400" />

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                Archive connections
              </p>

              <h2 className="mt-2 text-xl font-bold uppercase">
                Related Works
              </h2>
            </div>
          </div>

          {relations.length > 0 ? (
            <div className="mt-5 space-y-3">
              {relations.map((relation) => (
                <Link
                  key={`${relation.id}-${relation.relationType}`}
                  href={`/series/${relation.id}`}
                  className="group flex items-center justify-between gap-5 border border-slate-800 bg-[#070A0F] p-4 transition hover:border-cyan-400/50"
                >
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-amber-400">
                      {formatRelation(relation)}
                    </p>

                    <h3 className="mt-2 font-semibold uppercase group-hover:text-cyan-400">
                      {relation.title}
                    </h3>

                    <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                      {formatMediaType(relation.mediaType)}
                      {relation.releaseYear
                        ? ` // ${relation.releaseYear}`
                        : ""}
                    </p>
                  </div>

                  <ChevronRight
                    size={18}
                    className="shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-5 font-mono text-xs uppercase tracking-wider text-slate-600">
              No related works registered
            </p>
          )}
        </div>

        <div className="border border-slate-800 bg-[#0F172A] p-7">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <BookOpen size={18} className="text-cyan-400" />

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                Verification records
              </p>

              <h2 className="mt-2 text-xl font-bold uppercase">
                Reference Sources
              </h2>
            </div>
          </div>

          {sources.length > 0 ? (
            <div className="mt-5 space-y-3">
              {sources.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-5 border border-slate-800 bg-[#070A0F] p-4 transition hover:border-cyan-400/50"
                >
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">
                      {source.isPrimary ? "Primary source" : source.sourceType}
                    </p>

                    <h3 className="mt-2 font-semibold group-hover:text-cyan-400">
                      {source.title}
                    </h3>

                    {source.publisher && (
                      <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                        {source.publisher}
                      </p>
                    )}
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-slate-600 transition group-hover:text-cyan-400"
                  />
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-5 font-mono text-xs uppercase tracking-wider text-slate-600">
              No reference sources registered
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
