import type { NearbyLibraryItem } from "@/type/search";

export function isOperatingLibrary(library: NearbyLibraryItem) {
  return library.openNow;
}

export function filterOperatingLibraries(
  libraries: NearbyLibraryItem[],
) {
  return libraries.filter(isOperatingLibrary);
}
