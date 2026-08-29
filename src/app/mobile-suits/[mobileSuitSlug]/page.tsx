import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Radio, UserRound } from "lucide-react";

import FormSwitcher from "@/components/mobile-suit/FormSwitcher";
import {
  getMobileSuitByIdFromDatabase,
  getMobileSuitsFromDatabase,
} from "@/lib/data/getMobileSuitsFromDatabase";
import { getCharactersFromDatabase } from "@/lib/data/getCharactersFromDatabase";
import { getAllSeriesFromDatabase } from "@/lib/data/getSeriesFromDatabase";
import { getTimelineByIdFromDatabase } from "@/lib/data/getTimelinesFromDatabase";
import { getPilotLogsByMobileSuitIdFromDatabase } from "@/lib/data/getPilotLogsFromDatabase";

interface MobileSuitDetailPageProps {
  params: Promise<{
    mobileSuitSlug: string;
  }>;
}

export async function generateStaticParams() {
  const mobileSuits = await getMobileSuitsFromDatabase();

  return mobileSuits.map((mobileSuit) => ({
    mobileSuitSlug: mobileSuit.id,
  }));
}

export async function generateMetadata({ params }: MobileSuitDetailPageProps) {
  const { mobileSuitSlug } = await params;
  const mobileSuit = await getMobileSuitByIdFromDatabase(mobileSuitSlug);

  if (!mobileSuit) {
    return {
      title: "Mobile Suit Record Not Found",
    };
  }

  return {
    title: `${mobileSuit.modelNumber} ${mobileSuit.baseName}`,
    description: mobileSuit.variants[0]?.description,
  };
}

export default async function MobileSuitDetailPage({
  params,
}: MobileSuitDetailPageProps) {
  const { mobileSuitSlug } = await params;
  const mobileSuit = await getMobileSuitByIdFromDatabase(mobileSuitSlug);
  if (!mobileSuit) {
    notFound();
  }

  const [timeline, seriesRecords, characters, pilotLogs] = await Promise.all([
    getTimelineByIdFromDatabase(mobileSuit.timelineId),
    getAllSeriesFromDatabase(),
    getCharactersFromDatabase(),
    getPilotLogsByMobileSuitIdFromDatabase(mobileSuit.id),
  ]);

  const seriesMap = new Map(seriesRecords.map((series) => [series.id, series]));

  const characterMap = new Map(
    characters.map((character) => [character.id, character]),
  );

  const relatedSeries = mobileSuit.seriesIds
    .map((seriesId) => seriesMap.get(seriesId))
    .filter((series) => series !== undefined);

  const assignedPilots = characters.filter((character) =>
    character.eras.some((era) => era.pilotedUnitIds.includes(mobileSuit.id)),
  );

  const variantPilotAssignments = pilotLogs.flatMap((log) => {
    const character = characterMap.get(log.characterId);

    if (!character) {
      return [];
    }

    return [
      {
        variantId: log.variantId,
        characterId: character.id,
        characterName: character.canonicalName,
        notes: log.notes,
      },
    ];
  });

  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100">
      <header className="border-b border-slate-800">
        <div
          className="mx-auto flex max-w-7xl items-center 
justify-between px-6 py-6"
        >
          <Link
            href="/mobile-suits"
            className="inline-flex items-center gap-2 font-mono text-xs 
uppercase tracking-wider text-slate-500 hover:text-cyan-400"
          >
            <ArrowLeft size={15} />
            Mobile Suit database
          </Link>

          <div
            className="flex items-center gap-2 font-mono text-[10px] 
uppercase tracking-wider text-emerald-400"
          >
            <Radio size={13} className="animate-pulse" />
            Mechanical record verified
          </div>
        </div>
      </header>

      <section
        className="relative overflow-hidden border-b 
border-slate-800"
      >
        <div
          className="absolute inset-0 
bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] 
bg-[size:48px_48px]"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="border border-cyan-400/30 px-3 py-1 font-mono 
text-xs uppercase tracking-wider text-cyan-400"
            >
              {timeline?.code ?? "Unknown timeline"}
            </span>

            <span
              className="font-mono text-xs uppercase tracking-wider 
text-emerald-400"
            >
              ● {mobileSuit.status}
            </span>

            <span
              className="font-mono text-xs uppercase tracking-wider 
text-slate-500"
            >
              {mobileSuit.variants.length} configurations
            </span>
          </div>

          <p
            className="mt-9 font-mono text-lg font-bold tracking-[0.3em] 
text-amber-400 md:text-2xl"
          >
            {mobileSuit.modelNumber}
          </p>

          <h1
            className="mt-4 text-5xl font-black uppercase leading-none 
md:text-7xl"
          >
            {mobileSuit.baseName}
          </h1>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <ArchiveInformation
              label="Timeline"
              value={timeline?.name ?? "Unknown"}
            />

            <ArchiveInformation
              label="Manufacturer"
              value={mobileSuit.manufacturer}
              icon={<Building2 size={14} />}
            />

            <ArchiveInformation
              label="Series appearances"
              value={String(relatedSeries.length).padStart(2, "0")}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <FormSwitcher
          variants={mobileSuit.variants}
          pilotAssignments={variantPilotAssignments}
        />
      </section>

      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p
            className="font-mono text-xs uppercase tracking-[0.3em] 
text-amber-400"
          >
            Cross-linked Records
          </p>

          <h2 className="mt-3 text-3xl font-bold uppercase">Assigned Pilots</h2>

          {assignedPilots.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {assignedPilots.map((pilot) => (
                <Link
                  key={pilot.id}
                  href={`/characters/${pilot.id}`}
                  className="group flex items-center gap-5 border 
border-slate-800 bg-[#0F172A] p-5 transition hover:border-cyan-400/60"
                >
                  <div
                    className="flex h-14 w-14 items-center 
justify-center border border-slate-700 bg-[#070A0F]"
                  >
                    <UserRound
                      size={25}
                      className="text-slate-600 group-hover:text-cyan-400"
                    />
                  </div>

                  <div>
                    <p
                      className="font-bold uppercase 
group-hover:text-cyan-400"
                    >
                      {pilot.canonicalName}
                    </p>

                    <p
                      className="mt-1 font-mono text-[10px] uppercase 
tracking-wider text-slate-500"
                    >
                      Open personnel record
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="mt-8 border border-dashed border-slate-700 
p-8"
            >
              <p
                className="font-mono text-xs uppercase tracking-wider 
text-slate-600"
              >
                No assigned pilot records found
              </p>
            </div>
          )}

          <div className="mt-12">
            <p
              className="font-mono text-xs uppercase tracking-[0.25em] 
text-slate-500"
            >
              Series appearances
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {relatedSeries.map((series) => (
                <Link
                  key={series.id}
                  href={`/series/${series.id}`}
                  className="border border-slate-700 bg-[#0F172A] px-5 
py-3 font-mono text-xs uppercase tracking-wider text-slate-400 transition 
hover:border-cyan-400/60 hover:text-cyan-400"
                >
                  {series.titles.en}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface ArchiveInformationProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function ArchiveInformation({ label, value, icon }: ArchiveInformationProps) {
  return (
    <div className="border border-slate-800 bg-[#0F172A]/90 p-5">
      <div
        className="flex items-center gap-2 font-mono text-[10px] 
uppercase tracking-wider text-slate-500"
      >
        {icon}
        {label}
      </div>

      <p className="mt-3 text-sm text-slate-200">{value}</p>
    </div>
  );
}
