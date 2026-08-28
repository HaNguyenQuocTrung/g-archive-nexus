import Link from "next/link";
import { ChevronRight, Wrench } from "lucide-react";

import { getMobileSuitById } from "@/lib/data/getMobileSuits";
import { getPilotLogsByCharacterId } from "@/lib/data/getPilotLogs";

interface CombatCareerProps {
  characterId: string;
  characterEraId: string;
}

export default function CombatCareer({
  characterId,
  characterEraId,
}: CombatCareerProps) {
  const logs = getPilotLogsByCharacterId(characterId)
    .filter(
      (log) =>
        log.characterEraId === characterEraId,
    );

  return (
    <section className="mt-8 border-t border-slate-800 pt-7">
      <div className="flex items-center gap-3">
        <Wrench
          size={17}
          className="text-cyan-400"
        />

        <h3
          className={[
            "font-mono text-xs uppercase",
            "tracking-[0.2em]",
          ].join(" ")}
        >
          Combat Career
        </h3>
      </div>

      {logs.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {logs.map((log) => {
            const mobileSuit = getMobileSuitById(
              log.mobileSuitId,
            );

            const variant = mobileSuit?.variants.find(
              (item) => item.id === log.variantId,
            );

            return (
              <Link
                key={log.id}
                href={`/mobile-suits/${log.mobileSuitId}`}
                className={[
                  "group border border-slate-700",
                  "bg-[#070A0F] p-4 transition",
                  "hover:border-cyan-400/50",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex items-start",
                    "justify-between gap-4",
                  ].join(" ")}
                >
                  <div>
                    <p
                      className={[
                        "font-mono text-[10px]",
                        "uppercase tracking-wider",
                        "text-amber-400",
                      ].join(" ")}
                    >
                      {mobileSuit?.modelNumber ??
                        log.mobileSuitId}
                    </p>

                    <h4
                      className={[
                        "mt-2 font-semibold uppercase",
                        "group-hover:text-cyan-400",
                      ].join(" ")}
                    >
                      {mobileSuit?.baseName ??
                        log.mobileSuitId}
                    </h4>

                    <p
                      className={[
                        "mt-2 font-mono text-[9px]",
                        "uppercase tracking-wider",
                        "text-slate-500",
                      ].join(" ")}
                    >
                      Form //{" "}
                      {variant?.formName ??
                        log.variantId}
                    </p>
                  </div>

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

                {log.notes && (
                  <p
                    className={[
                      "mt-4 border-t",
                      "border-slate-800 pt-3",
                      "text-sm leading-6",
                      "text-slate-500",
                    ].join(" ")}
                  >
                    {log.notes}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <p
          className={[
            "mt-5 font-mono text-xs uppercase",
            "tracking-wider text-slate-600",
          ].join(" ")}
        >
          No Pilot Log records registered
        </p>
      )}
    </section>
  );
}