import athrunInfiniteJusticeTypeII from "@/data/pilot-logs/athrun-infinite-justice-type-ii.json";
import kiraMightyStrikeFreedom from "@/data/pilot-logs/kira-mighty-strike-freedom.json";
import kiraStrikeFreedomTypeII from "@/data/pilot-logs/kira-strike-freedom-type-ii.json";
import kiraRisingFreedomMa from "@/data/pilot-logs/kira-rising-freedom-ma.json";
import kiraRisingFreedomMs from "@/data/pilot-logs/kira-rising-freedom-ms.json";
import athrunAegisMa from "@/data/pilot-logs/athrun-aegis-ma-mode.json";
import athrunAegisMs from "@/data/pilot-logs/athrun-aegis-ms-mode.json";
import kiraLauncherStrike from "@/data/pilot-logs/kira-launcher-strike.json";
import kiraSwordStrike from "@/data/pilot-logs/kira-sword-strike.json";
import amuroRx78 from "@/data/pilot-logs/amuro-rx78-standard.json";
import charMs06s from "@/data/pilot-logs/char-ms06s-custom.json";
import kiraAileStrike from "@/data/pilot-logs/kira-aile-strike.json";
import kiraFreedom from "@/data/pilot-logs/kira-freedom-standard.json";
import kiraStrike from "@/data/pilot-logs/kira-strike-standard.json";

import { pilotLogSchema } from "@/lib/validation/schemas";
import type { PilotLog } from "@/types";

const pilotLogs: PilotLog[] = pilotLogSchema
  .array()
  .parse([
    amuroRx78,
    charMs06s,
    kiraStrike,
    kiraAileStrike,
    kiraSwordStrike,
    kiraLauncherStrike,
    kiraFreedom,
    athrunAegisMs,
    athrunAegisMa,
    kiraRisingFreedomMs,
    kiraRisingFreedomMa,
    kiraStrikeFreedomTypeII,
    kiraMightyStrikeFreedom,
    athrunInfiniteJusticeTypeII,
  ]);

export function getPilotLogs(): PilotLog[] {
  return pilotLogs;
}

export function getPilotLogsByCharacterId(characterId: string): PilotLog[] {
  return pilotLogs.filter((log) => log.characterId === characterId);
}

export function getPilotLogsByMobileSuitId(mobileSuitId: string): PilotLog[] {
  return pilotLogs.filter((log) => log.mobileSuitId === mobileSuitId);
}

export function getPilotLogsByVariantId(
  mobileSuitId: string,
  variantId: string,
): PilotLog[] {
  return pilotLogs.filter(
    (log) => log.mobileSuitId === mobileSuitId && log.variantId === variantId,
  );
}
