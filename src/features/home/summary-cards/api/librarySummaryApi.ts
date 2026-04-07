import librarySummary from "./librarySummary.json";

export type LibrarySummary = {
  nearbyLibraryCount: number;
  openLibraryCount: number;
};

export async function getLibrarySummary(): Promise<LibrarySummary> {
  return librarySummary;
}
