import type { LibrarySummary } from "@/type/home";

export async function getLibrarySummary(): Promise<LibrarySummary> {
  return {
    nearbyLibraryCount: 0,
    openLibraryCount: 0,
  };
}
