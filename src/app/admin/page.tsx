import { createClient } from "@/lib/supabase/server";

const cards = [
  { key: "timelines", label: "Timelines" },
  { key: "series", label: "Series" },
  { key: "characters", label: "Characters" },
  { key: "mobile_suits", label: "Mobile Suits" },
] as const;

export default async function AdminPage() {
  const supabase = await createClient();

  const results = await Promise.all(
    cards.map(({ key }) =>
      supabase.from(key).select("*", {
        count: "exact",
        head: true,
      }),
    ),
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">
        Administration sector
      </p>

      <h1 className="mt-4 text-4xl font-bold uppercase">Archive Control</h1>

      <p className="mt-3 text-slate-400">
        Manage canonical records, community content and interactive systems.
      </p>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ key, label }, index) => (
          <article
            key={key}
            className="border border-slate-800 bg-[#0F172A] p-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Record sector {String(index + 1).padStart(2, "0")}
            </p>

            <p className="mt-5 font-mono text-4xl text-cyan-400">
              {String(results[index].count ?? 0).padStart(2, "0")}
            </p>

            <h2 className="mt-3 font-bold uppercase">{label}</h2>
          </article>
        ))}
      </section>

      <section className="mt-10 border border-slate-800 bg-[#0F172A] p-7">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
          Database connection online
        </p>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          Official Archive tables are connected. Record creation tools will
          become available after the existing JSON archive is migrated.
        </p>
      </section>
    </main>
  );
}
