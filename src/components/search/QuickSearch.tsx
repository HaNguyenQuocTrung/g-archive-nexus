"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { ChevronRight, Search, X } from "lucide-react";

import type {
  ArchiveSearchRecord,
  SearchRecordType,
} from "@/lib/search/searchArchive";

interface QuickSearchProps {
  records: ArchiveSearchRecord[];
  initialQuery?: string;
}

type SearchFilter = "all" | SearchRecordType;

const filters: Array<{
  label: string;
  value: SearchFilter;
}> = [
  { label: "All records", value: "all" },
  { label: "Timelines", value: "timeline" },
  { label: "Series", value: "series" },
  { label: "Pilots", value: "character" },
  { label: "Mobile Suits", value: "mobile-suit" },
];

export default function QuickSearch({
  records,
  initialQuery = "",
}: QuickSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] =
    useState<SearchFilter>("all");

  const fuse = useMemo(() => {
    return new Fuse(records, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "subtitle", weight: 0.25 },
        { name: "keywords", weight: 0.25 },
        { name: "description", weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [records]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim();

    const matched = normalizedQuery
      ? fuse.search(normalizedQuery).map((item) => item.item)
      : records;

    if (activeFilter === "all") {
      return matched;
    }

    return matched.filter(
      (record) => record.type === activeFilter,
    );
  }, [activeFilter, fuse, query, records]);

  return (
    <section>
      <div
        className={[
          "border border-cyan-400/20",
          "bg-[#0F172A] p-6",
        ].join(" ")}
      >
        <label
          htmlFor="archive-search"
          className={[
            "font-mono text-[10px] uppercase",
            "tracking-[0.25em] text-cyan-400",
          ].join(" ")}
        >
          Archive search query
        </label>

        <div
          className={[
            "mt-4 flex border border-slate-700",
            "bg-[#070A0F]",
            "focus-within:border-cyan-400",
          ].join(" ")}
        >
          <Search
            size={20}
            className="ml-4 self-center text-cyan-400"
          />

          <input
            id="archive-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="RX-78-2, KIRA, BEAM RIFLE..."
            autoComplete="off"
            className={[
              "min-w-0 flex-1 bg-transparent",
              "px-4 py-5 font-mono text-sm",
              "text-white outline-none",
              "placeholder:text-slate-600",
            ].join(" ")}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className={[
                "px-4 text-slate-500",
                "hover:text-red-400",
              ].join(" ")}
            >
              <X size={19} />
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const active =
              activeFilter === filter.value;

            const activeClasses = [
              "border border-cyan-400",
              "bg-cyan-400 text-slate-950",
            ];

            const inactiveClasses = [
              "border border-slate-700",
              "bg-[#070A0F] text-slate-500",
              "hover:border-cyan-400/50",
              "hover:text-cyan-400",
            ];

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => {
                  setActiveFilter(filter.value);
                }}
                className={[
                  "px-4 py-2 font-mono",
                  "text-[10px] uppercase tracking-wider",
                  "transition",
                  ...(active
                    ? activeClasses
                    : inactiveClasses),
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={[
          "mt-8 flex items-center",
          "justify-between",
        ].join(" ")}
      >
        <p
          className={[
            "font-mono text-xs uppercase",
            "tracking-wider text-slate-500",
          ].join(" ")}
        >
          {String(results.length).padStart(2, "0")} records found
        </p>

        {query && (
          <p
            className={[
              "font-mono text-[10px] uppercase",
              "tracking-wider text-cyan-400",
            ].join(" ")}
          >
            Query // {query}
          </p>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-5 space-y-4">
          {results.map((record) => (
            <Link
              key={`${record.type}-${record.id}`}
              href={record.href}
              className={[
                "group grid gap-5",
                "border border-slate-800",
                "bg-[#0F172A] p-6 transition",
                "hover:border-cyan-400/60",
                "sm:grid-cols-[1fr_auto]",
                "sm:items-center",
              ].join(" ")}
            >
              <div>
                <div
                  className={[
                    "flex flex-wrap items-center",
                    "gap-3",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "border border-cyan-400/30",
                      "px-2 py-1 font-mono",
                      "text-[9px] uppercase",
                      "tracking-wider text-cyan-400",
                    ].join(" ")}
                  >
                    {formatRecordType(record.type)}
                  </span>

                  <span
                    className={[
                      "font-mono text-[10px]",
                      "uppercase tracking-wider",
                      "text-amber-400",
                    ].join(" ")}
                  >
                    {record.subtitle}
                  </span>
                </div>

                <h2
                  className={[
                    "mt-4 text-xl font-bold uppercase",
                    "group-hover:text-cyan-400",
                  ].join(" ")}
                >
                  {record.title}
                </h2>

                <p
                  className={[
                    "mt-3 line-clamp-2 max-w-4xl",
                    "text-sm leading-6 text-slate-500",
                  ].join(" ")}
                >
                  {record.description}
                </p>
              </div>

              <ChevronRight
                size={24}
                className={[
                  "hidden text-slate-600 transition",
                  "group-hover:translate-x-1",
                  "group-hover:text-cyan-400",
                  "sm:block",
                ].join(" ")}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div
          className={[
            "mt-5 border border-dashed",
            "border-slate-700 px-6 py-16",
            "text-center",
          ].join(" ")}
        >
          <Search
            size={38}
            className="mx-auto text-slate-700"
          />

          <p
            className={[
              "mt-5 font-mono text-sm uppercase",
              "tracking-[0.2em] text-slate-500",
            ].join(" ")}
          >
            No archive records matched
          </p>

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveFilter("all");
            }}
            className={[
              "mt-6 font-mono text-xs uppercase",
              "tracking-wider text-cyan-400",
              "hover:text-cyan-300",
            ].join(" ")}
          >
            Reset search parameters
          </button>
        </div>
      )}
    </section>
  );
}

function formatRecordType(
  type: SearchRecordType,
): string {
  switch (type) {
    case "mobile-suit":
      return "Mobile Suit";
    case "character":
      return "Pilot";
    case "timeline":
      return "Timeline";
    case "series":
      return "Series";
  }
}
