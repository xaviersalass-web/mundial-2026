// The football-data.org API returns team names in English ("Mexico", "South Korea").
// For ES mode we localize country names by TLA. EN mode uses the API name as-is.
// Covers all 48 qualified teams for World Cup 2026 (TLAs verified against the API).

import type { Lang } from "@/lib/i18n/dict";
import type { TeamRef } from "@/lib/types/models";

export const COUNTRY_ES: Record<string, string> = {
  URY: "Uruguay",
  GER: "Alemania",
  ESP: "España",
  PAR: "Paraguay",
  ARG: "Argentina",
  GHA: "Ghana",
  BRA: "Brasil",
  POR: "Portugal",
  JPN: "Japón",
  MEX: "México",
  ENG: "Inglaterra",
  USA: "Estados Unidos",
  KOR: "Corea del Sur",
  FRA: "Francia",
  RSA: "Sudáfrica",
  ALG: "Argelia",
  AUS: "Australia",
  NZL: "Nueva Zelanda",
  SUI: "Suiza",
  ECU: "Ecuador",
  SWE: "Suecia",
  CZE: "Chequia",
  CRO: "Croacia",
  KSA: "Arabia Saudita",
  TUN: "Túnez",
  TUR: "Turquía",
  SEN: "Senegal",
  BEL: "Bélgica",
  MAR: "Marruecos",
  AUT: "Austria",
  COL: "Colombia",
  EGY: "Egipto",
  CAN: "Canadá",
  HAI: "Haití",
  IRN: "Irán",
  BIH: "Bosnia y Herzegovina",
  PAN: "Panamá",
  CPV: "Cabo Verde",
  COD: "RD del Congo",
  CIV: "Costa de Marfil",
  QAT: "Catar",
  JOR: "Jordania",
  IRQ: "Irak",
  UZB: "Uzbekistán",
  NED: "Países Bajos",
  NOR: "Noruega",
  SCO: "Escocia",
  CUW: "Curazao",
};

/** Localized display name for a team: Spanish country name in ES mode, else the API name. */
export function teamName(team: Pick<TeamRef, "name" | "tla">, lang: Lang): string {
  if (lang === "es" && team.tla && COUNTRY_ES[team.tla]) {
    return COUNTRY_ES[team.tla];
  }
  return team.name;
}
