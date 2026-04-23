import librarySummary from "@/data/librarySummary.json";
import type { LibrarySummary } from "@/type/home";

export async function getLibrarySummary(): Promise<LibrarySummary> {
  return librarySummary;
}
