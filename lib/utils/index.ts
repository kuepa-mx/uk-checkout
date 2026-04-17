import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to normalize accented characters
export function removeAccents(value: unknown): string {
  if (typeof value !== "string") return "";
  // Normalize Unicode accents and remove diacritics
  return value
    .normalize("NFD") // split accented characters (é → e + ́)
    .replace(/[\u0300-\u036f]/g, ""); // remove the accent marks
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}


export function isPsychologyMaster(career: TCareer) {
  const mastersPsychologyIds = [
    // Masters Psico
    '747d2a1c-0903-4608-bead-9d308e1fb455',
    '7f28c840-48ce-47bc-b330-18748ba73601',
    '322789e5-9666-4a2b-9893-b6fff10af707',
    '90161738-68db-4797-bdb3-584d461a16b6',
    'a56c8311-4368-4aca-a924-c3406cbd1001',
    'c7a786ed-e4ac-4d30-a54f-d61c226e180d',
    '27848edc-4cd6-4ce9-8ee6-8a6e06442193',
    'b8d60599-67dd-4e48-938d-fad2910147c9',
  ]
  return mastersPsychologyIds.includes(career.carrera_id);
}

export const APERTURE_DATES = [
  "2025-11-24",
  "2026-01-19",
  "2026-02-09",
  "2026-03-02",
  "2026-04-06",
  "2026-04-27",
  "2026-05-18",
  "2026-06-08",
  "2026-06-29",
  "2026-07-20",
  "2026-08-17",
  "2026-09-07",
  "2026-09-28",
  "2026-10-19",
  "2026-11-09",
  "2026-11-30",
] as const;

export function getNextApertureDate(): string {
  const now = new Date();
  const next = APERTURE_DATES.find(
    (d) => new Date(`${d}T00:00:00`) >= now,
  );
  if (!next) throw new Error("No upcoming aperture dates available");
  return next;
}