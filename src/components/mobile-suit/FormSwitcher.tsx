"use client";

import { useState } from "react";
import {
  Crosshair,
  Cpu,
  Database,
  Shield,
  Weight,
  UserRound,
} from "lucide-react";

interface VariantPilotAssignment {
  variantId: string;
  characterId: string;
  characterName: string;
  notes?: string;
}

import type { MobileSuitVariant } from "@/types";

interface FormSwitcherProps {
  variants: MobileSuitVariant[];
  pilotAssignments: VariantPilotAssignment[];
}

export default function FormSwitcher({
  variants,
  pilotAssignments,
}: FormSwitcherProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id ?? "",
  );

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];

  const selectedPilots = pilotAssignments.filter(
    (assignment) => assignment.variantId === selectedVariant?.id,
  );

  if (!selectedVariant) {
    return (
      <div className="border border-red-500/30 p-6 font-mono text-sm uppercase text-red-400">
        No configuration data registered
      </div>
    );
  }

  const { specs } = selectedVariant;

  return (
    <div>
      <section className="border border-slate-800 bg-[#0F172A] p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
          Configuration selector
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {variants.map((variant) => {
            const active = variant.id === selectedVariant.id;

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                className={
                  active
                    ? "border border-cyan-400 bg-cyan-400 px-5 py-3 font-mono text-xs uppercase tracking-wider text-slate-950"
                    : "border border-slate-700 bg-[#070A0F] px-5 py-3 font-mono text-xs uppercase tracking-wider text-slate-400 transition hover:border-cyan-400/60 hover:text-cyan-400"
                }
              >
                {variant.formName}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex min-h-[520px] items-center justify-center border border-cyan-400/20 bg-[#070A0F]">
          <div className="text-center">
            <Cpu
              size={110}
              strokeWidth={0.7}
              className="mx-auto text-cyan-400/50"
            />

            <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-slate-600">
              Blueprint data pending
            </p>

            <p className="mt-3 font-mono text-sm uppercase tracking-wider text-cyan-400">
              {selectedVariant.formName}
            </p>
          </div>
        </div>

        <div>
          <div className="border border-slate-800 bg-[#0F172A] p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400">
              Active configuration
            </p>

            <h2 className="mt-4 text-3xl font-bold uppercase">
              {selectedVariant.formName}
            </h2>

            <p className="mt-5 leading-8 text-slate-400">
              {selectedVariant.description}
            </p>
          </div>
          <div
            className={[
              "mt-6 border border-slate-800",
              "bg-[#0F172A] p-7",
            ].join(" ")}
          >
            <div
              className={[
                "flex items-center gap-3",
                "border-b border-slate-800 pb-5",
              ].join(" ")}
            >
              <UserRound size={18} className="text-cyan-400" />

              <h3
                className={[
                  "font-mono text-sm uppercase",
                  "tracking-[0.2em]",
                ].join(" ")}
              >
                Assigned Pilots
              </h3>
            </div>

            {selectedPilots.length > 0 ? (
              <div className="mt-5 space-y-3">
                {selectedPilots.map((pilot) => (
                  <a
                    key={`${pilot.variantId}-${pilot.characterId}`}
                    href={`/characters/${pilot.characterId}`}
                    className={[
                      "block border border-slate-800",
                      "bg-[#070A0F] p-4 transition",
                      "hover:border-cyan-400/50",
                    ].join(" ")}
                  >
                    <p
                      className={[
                        "font-semibold uppercase",
                        "text-cyan-400",
                      ].join(" ")}
                    >
                      {pilot.characterName}
                    </p>

                    {pilot.notes && (
                      <p
                        className={[
                          "mt-2 text-sm leading-6",
                          "text-slate-500",
                        ].join(" ")}
                      >
                        {pilot.notes}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <p
                className={[
                  "mt-5 font-mono text-xs uppercase",
                  "tracking-wider text-slate-600",
                ].join(" ")}
              >
                No pilot assigned to this configuration
              </p>
            )}
          </div>
          <div className="mt-6 border border-slate-800 bg-[#0F172A] p-7">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
              <Database size={18} className="text-cyan-400" />

              <h3 className="font-mono text-sm uppercase tracking-[0.2em]">
                Technical Specifications
              </h3>
            </div>

            <div className="mt-5 divide-y divide-slate-800">
              <SpecificationRow
                label="Overall height"
                value={formatMeasurement(specs.heightMeters, "m")}
              />

              <SpecificationRow
                label="Base weight"
                value={formatMeasurement(specs.baseWeightTons, "t")}
              />

              <SpecificationRow
                label="Gross weight"
                value={formatMeasurement(specs.grossWeightTons, "t")}
              />

              <SpecificationRow label="Generator" value={specs.generatorType} />

              <SpecificationRow
                label="Generator output"
                value={formatMeasurement(specs.generatorOutputKw, "kW")}
              />

              <SpecificationRow
                label="Armor material"
                value={specs.armorMaterial}
              />

              <SpecificationRow
                label="Sensor range"
                value={formatMeasurement(specs.sensorRangeMeters, "m")}
              />

              <SpecificationRow
                label="Crew"
                value={specs.crew ? `${specs.crew} pilot` : undefined}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="border border-slate-800 bg-[#0F172A] p-7">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <Crosshair size={18} className="text-red-400" />

              <h3 className="font-mono text-sm uppercase tracking-[0.2em]">
                Arsenal Breakdown
              </h3>
            </div>

            <span className="font-mono text-xs text-slate-500">
              {String(selectedVariant.armaments.length).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {selectedVariant.armaments.map((weapon) => (
              <article
                key={weapon.id}
                className="border border-slate-800 bg-[#070A0F] p-5"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h4 className="font-semibold uppercase text-slate-200">
                      {weapon.name}
                    </h4>

                    <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-red-400">
                      {weapon.mountingLocation ?? "Location unknown"}
                    </p>
                  </div>

                  {weapon.quantity && (
                    <span className="font-mono text-xs text-slate-500">
                      ×{weapon.quantity}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {weapon.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="border border-slate-800 bg-[#0F172A] p-7">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-amber-400" />

              <h3 className="font-mono text-sm uppercase tracking-[0.2em]">
                Special Systems
              </h3>
            </div>

            <span className="font-mono text-xs text-slate-500">
              {String(selectedVariant.specialSystems.length).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {selectedVariant.specialSystems.map((system) => (
              <article
                key={system.id}
                className="border border-slate-800 bg-[#070A0F] p-5"
              >
                <h4 className="font-semibold uppercase text-amber-300">
                  {system.name}
                </h4>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {system.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

interface SpecificationRowProps {
  label: string;
  value?: string;
}

function SpecificationRow({ label, value }: SpecificationRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-5 py-4">
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <span className="text-right font-mono text-sm text-slate-200">
        {value ?? "N/A"}
      </span>
    </div>
  );
}

function formatMeasurement(
  value: number | undefined,
  unit: string,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return `${value} ${unit}`;
}
