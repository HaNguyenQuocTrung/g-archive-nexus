import CombatCareer from "@/components/character/CombatCareer";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Radio,
  Shield,
  UserRound,
  Volume2,
} from "lucide-react";

import {
  getCharacterById,
  getCharacters,
} from "@/lib/data/getCharacters";
import { getSeriesById } from "@/lib/data/getSeries";

interface CharacterProfilePageProps {
  params: Promise<{
    characterSlug: string;
  }>;
}

export function generateStaticParams() {
  return getCharacters().map((character) => ({
    characterSlug: character.id,
  }));
}

export async function generateMetadata({
  params,
}: CharacterProfilePageProps) {
  const { characterSlug } = await params;
  const character = getCharacterById(characterSlug);

  if (!character) {
    return {
      title: "Personnel Record Not Found",
    };
  }

  return {
    title: character.canonicalName,
    description: `Personnel and combat record for ${character.canonicalName}.`,
  };
}

export default async function CharacterProfilePage({
  params,
}: CharacterProfilePageProps) {
  const { characterSlug } = await params;
  const character = getCharacterById(characterSlug);

  if (!character) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500 hover:text-cyan-400"
          >
            <ArrowLeft size={15} />
            Pilot archive
          </Link>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            <Radio size={13} className="animate-pulse" />
            Personnel record verified
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[320px_1fr]">
          <aside>
            <div className="flex min-h-[400px] items-center justify-center border border-cyan-400/30 bg-[#0F172A]/90">
              <div className="text-center">
                <UserRound
                  size={88}
                  strokeWidth={1}
                  className="mx-auto text-cyan-400"
                />

                <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                  Portrait data pending
                </p>
              </div>
            </div>

            <div className="mt-4 border border-slate-800 bg-[#0F172A] p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                Archive status
              </p>

              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-emerald-400">
                ● {character.status}
              </p>
            </div>
          </aside>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
              Personnel Record // {character.id}
            </p>

            <h1 className="mt-5 text-5xl font-black uppercase md:text-7xl">
              {character.canonicalName}
            </h1>

            {character.japaneseName && (
              <p className="mt-4 text-xl text-slate-500">
                {character.japaneseName}
              </p>
            )}

            {character.voiceActors?.japanese && (
              <div className="mt-8 inline-flex items-center gap-3 border border-slate-800 bg-[#0F172A] px-4 py-3">
                <Volume2 size={16} className="text-cyan-400" />

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                    Japanese voice actor
                  </p>
                  <p className="mt-1 text-sm">
                    {character.voiceActors.japanese}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-12 space-y-8">
              {character.eras.map((era, index) => {
                const series = getSeriesById(era.seriesId);

                return (
                  <section
                    key={era.id}
                    className="border border-slate-800 bg-[#0F172A]/90 p-7"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-800 pb-6">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                          Era {String(index + 1).padStart(2, "0")}
                        </p>

                        <h2 className="mt-3 text-2xl font-bold uppercase">
                          {era.aliasName ?? character.canonicalName}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                          {series?.titles.en ?? era.seriesId}
                        </p>
                      </div>

                      <Link
                        href={`/series/${era.seriesId}`}
                        className="font-mono text-xs uppercase tracking-wider text-slate-500 hover:text-cyan-400"
                      >
                        Open series record →
                      </Link>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <InformationPanel
                        icon={<Shield size={15} />}
                        label="Faction"
                        value={era.faction}
                      />

                      <InformationPanel
                        label="Rank or position"
                        value={era.rank ?? "Not registered"}
                      />
                    </div>

                    <div className="mt-7">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400">
                        Biography
                      </p>

                      <p className="mt-4 max-w-4xl leading-8 text-slate-300">
                        {era.biography}
                      </p>
                    </div>

                    <CombatCareer
  characterId={character.id}
  characterEraId={era.id}
/>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface InformationPanelProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

function InformationPanel({
  icon,
  label,
  value,
}: InformationPanelProps) {
  return (
    <div className="border border-slate-800 bg-[#070A0F] p-4">
      <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </div>

      <p className="mt-3 text-sm text-slate-200">{value}</p>
    </div>
  );
}