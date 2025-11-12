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
