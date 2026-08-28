"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Cpu,
  UserRound,
} from "lucide-react";

interface ArchiveTabRecord {
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

interface SeriesArchiveTabsProps {
  cast: ArchiveTabRecord[];
  mobileSuits: ArchiveTabRecord[];
}

type ActiveTab = "cast" | "mobile-suits";

export default function SeriesArchiveTabs({
  cast,
  mobileSuits,
}: SeriesArchiveTabsProps) {
  const [activeTab, setActiveTab] =
    useState<ActiveTab>("cast");

  const activeRecords =
    activeTab === "cast" ? cast : mobileSuits;

  return (
    <section>
      <div
        className={[
          "flex flex-wrap gap-3",
          "border-b border-slate-800 pb-5",
        ].join(" ")}
      >
        <TabButton
          active={activeTab === "cast"}
          label="Character Cast"
          count={cast.length}
          icon={<UserRound size={16} />}
          onClick={() => setActiveTab("cast")}
        />

        <TabButton
          active={activeTab === "mobile-suits"}
          label="Mobile Suit Roster"
          count={mobileSuits.length}
          icon={<Cpu size={16} />}
          onClick={() =>
            setActiveTab("mobile-suits")
          }
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {activeRecords.map((record) => (
          <Link
            key={record.id}
            href={record.href}
            className={[
              "group flex items-center gap-5",
              "border border-slate-800",
              "bg-[#0F172A] p-5 transition",
              "hover:border-cyan-400/60",
            ].join(" ")}
          >
            <div
              className={[
                "flex h-14 w-14 shrink-0",
                "items-center justify-center",
                "border border-slate-700",
                "bg-[#070A0F]",
              ].join(" ")}
            >
              {activeTab === "cast" ? (
                <UserRound
                  size={24}
                  className="text-cyan-400"
                />
              ) : (
                <Cpu
                  size={24}
                  className="text-amber-400"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className={[
                  "truncate font-bold uppercase",
                  "group-hover:text-cyan-400",
                ].join(" ")}
              >
                {record.title}
              </h3>

              <p
                className={[
                  "mt-2 truncate font-mono",
                  "text-[9px] uppercase",
                  "tracking-wider text-slate-500",
                ].join(" ")}
              >
                {record.subtitle}
              </p>
            </div>

            <ChevronRight
              size={19}
              className={[
                "text-slate-600 transition",
                "group-hover:translate-x-1",
                "group-hover:text-cyan-400",
              ].join(" ")}
            />
          </Link>
        ))}
      </div>

      {activeRecords.length === 0 && (
        <div
          className={[
            "mt-6 border border-dashed",
            "border-slate-700 p-10 text-center",
          ].join(" ")}
        >
          <p
            className={[
              "font-mono text-xs uppercase",
              "tracking-wider text-slate-600",
            ].join(" ")}
          >
            No records registered
          </p>
        </div>
      )}
    </section>
  );
}

interface TabButtonProps {
  active: boolean;
  label: string;
  count: number;
  icon: React.ReactNode;
  onClick: () => void;
}

function TabButton({
  active,
  label,
  count,
  icon,
  onClick,
}: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-3",
        "border px-5 py-3",
        "font-mono text-xs uppercase",
        "tracking-wider transition",
        active
          ? "border-cyan-400 bg-cyan-400 text-slate-950"
          : [
              "border-slate-700",
              "bg-[#070A0F] text-slate-500",
              "hover:border-cyan-400/50",
              "hover:text-cyan-400",
            ].join(" "),
      ].join(" ")}
    >
      {icon}
      {label}
      <span className="opacity-60">
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}
