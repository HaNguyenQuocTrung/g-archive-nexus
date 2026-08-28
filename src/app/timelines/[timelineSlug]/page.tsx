import TimelineSeriesRecords from "@/components/timeline/TimelineSeriesRecords";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Radio } from "lucide-react";

import { getTimelineById, getTimelines } from "@/lib/data/getTimelines";

interface TimelineDetailPageProps {
  params: Promise<{
    timelineSlug: string;
  }>;
}

export function generateStaticParams() {
  return getTimelines().map((timeline) => ({
    timelineSlug: timeline.id,
  }));
}

export async function generateMetadata({ params }: TimelineDetailPageProps) {
  const { timelineSlug } = await params;
  const timeline = getTimelineById(timelineSlug);

  if (!timeline) {
    return {
      title: "Timeline Not Found",
    };
  }

  return {
    title: timeline.name,
    description: timeline.description,
  };
}

export default async function TimelineDetailPage({
  params,
}: TimelineDetailPageProps) {
  const { timelineSlug } = await params;
  const timeline = getTimelineById(timelineSlug);

  if (!timeline) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100">
      <div className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
            href="/timelines"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500 hover:text-cyan-400"
          >
            <ArrowLeft size={15} />
            Timeline matrix
          </Link>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            <Radio size={13} className="animate-pulse" />
            Archive online
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-amber-400">
            Timeline Record // {timeline.id}
          </p>

          <div className="mt-8 grid gap-12 lg:grid-cols-[0.35fr_1fr]">
            <div className="flex min-h-64 items-center justify-center border border-cyan-400/30 bg-[#0F172A]/80">
              <span className="font-mono text-8xl font-black text-cyan-400">
                {timeline.code}
              </span>
            </div>

            <div>
              <h1 className="text-5xl font-black uppercase md:text-7xl">
                {timeline.name}
              </h1>

              <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400">
                {timeline.description}
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="border border-slate-800 bg-[#0F172A] p-5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    Archive code
                  </p>
                  <p className="mt-3 font-mono text-xl text-cyan-400">
                    {timeline.code}
                  </p>
                </div>

                <div className="border border-slate-800 bg-[#0F172A] p-5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    Registered series
                  </p>
                  <p className="mt-3 font-mono text-xl">
                    {timeline.seriesIds.length.toString().padStart(2, "0")}
                  </p>
                </div>
              </div>

              <TimelineSeriesRecords timelineId={timeline.id} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
