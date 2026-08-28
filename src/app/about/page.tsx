import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Info,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "About",
  description:
    "About the G-Archive Nexus fan-made project.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#070A0F] text-slate-100">
      <div className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Link
            href="/"
            className={[
              "inline-flex items-center gap-2",
              "font-mono text-xs uppercase",
              "tracking-wider text-slate-500",
              "hover:text-cyan-400",
            ].join(" ")}
          >
            <ArrowLeft size={15} />
            Return to terminal
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div
          className={[
            "absolute inset-0",
            "bg-[linear-gradient(",
            "rgba(6,182,212,0.04)_1px,",
            "transparent_1px)]",
            "bg-[size:48px_48px]",
          ].join("")}
        />

        <div
          className={[
            "relative mx-auto max-w-5xl",
            "px-6 py-20",
          ].join(" ")}
        >
          <div className="flex items-center gap-4">
            <Database
              size={34}
              className="text-cyan-400"
            />

            <p
              className={[
                "font-mono text-xs uppercase",
                "tracking-[0.3em] text-cyan-400",
              ].join(" ")}
            >
              GAN-INFO // Project Record
            </p>
          </div>

          <h1
            className={[
              "mt-8 text-5xl font-black uppercase",
              "md:text-7xl",
            ].join(" ")}
          >
            About the Archive
          </h1>

          <p
            className={[
              "mt-8 max-w-4xl text-lg",
              "leading-8 text-slate-300",
            ].join(" ")}
          >
            G-Archive Nexus is a fan-made information
            portal created to organize Mobile Suit,
            character, series and timeline records in
            one interconnected archive.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <InformationBlock
              icon={<Info className="text-cyan-400" />}
              title="Project Mission"
            >
              The project presents Gundam information
              through a tactical science-fiction interface.
              It focuses on structured technical records,
              historical chronology and cross-linked pilot
              and Mobile Suit profiles.
            </InformationBlock>

            <InformationBlock
              icon={
                <ShieldCheck className="text-amber-400" />
              }
              title="Fan Project Status"
            >
              G-Archive Nexus is an independent,
              non-commercial fan archive. It is not an
              official Gundam website and is not affiliated
              with or endorsed by Bandai Namco,
              Sunrise or Sotsu.
            </InformationBlock>
          </div>

          <section
            className={[
              "mt-8 border border-slate-800",
              "bg-[#0F172A] p-7",
            ].join(" ")}
          >
            <p
              className={[
                "font-mono text-xs uppercase",
                "tracking-[0.25em] text-amber-400",
              ].join(" ")}
            >
              Intellectual Property Notice
            </p>

            <p className="mt-5 leading-8 text-slate-400">
              Gundam, associated character names,
              Mobile Suit designs, series titles and
              related trademarks belong to their
              respective rights holders. Original
              artwork and official images should only
              be used with appropriate permission,
              attribution or lawful authorization.
            </p>
          </section>

          <section
            className={[
              "mt-8 border border-slate-800",
              "bg-[#0F172A] p-7",
            ].join(" ")}
          >
            <p
              className={[
                "font-mono text-xs uppercase",
                "tracking-[0.25em] text-cyan-400",
              ].join(" ")}
            >
              Archive Operator
            </p>

            <p className="mt-5 text-lg font-semibold">
              Hạ Nguyễn Quốc Trung
            </p>

            <p className="mt-2 font-mono text-xs text-slate-500">
              PROJECT OWNER // G-ARCHIVE NEXUS
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

interface InformationBlockProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function InformationBlock({
  icon,
  title,
  children,
}: InformationBlockProps) {
  return (
    <article
      className={[
        "border border-slate-800",
        "bg-[#0F172A] p-7",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        {icon}

        <h2 className="font-bold uppercase">
          {title}
        </h2>
      </div>

      <p className="mt-5 leading-7 text-slate-400">
        {children}
      </p>
    </article>
  );
}