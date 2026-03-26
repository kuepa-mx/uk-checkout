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

export function isPsychologyMaster(career: TCareer) {
  return career.carrera_codigo.startsWith("PSY");
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