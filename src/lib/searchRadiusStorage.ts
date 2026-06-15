import { HomeSearchRadiusKm } from "@/type/radius";

const SEARCH_RADIUS_STORAGE_KEY = "polarstar-search-radius-km";
export const SEARCH_RADIUS_STORAGE_CHANGE_EVENT =
  "polarstar-search-radius-change";

export function isSearchRadiusValue(
  value: number,
): value is HomeSearchRadiusKm {
  return Object.values(HomeSearchRadiusKm).includes(value);
}

export function parseSearchRadius(
  value: string | null | undefined,
): HomeSearchRadiusKm | null {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || !isSearchRadiusValue(parsedValue)) {
    return null;
  }

  return parsedValue;
}

export function getStoredSearchRadius() {
  if (typeof window === "undefined") {
    return null;
  }

  return parseSearchRadius(
    window.localStorage.getItem(SEARCH_RADIUS_STORAGE_KEY),
  );
}

export function setStoredSearchRadius(radius: HomeSearchRadiusKm) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SEARCH_RADIUS_STORAGE_KEY, String(radius));
  window.dispatchEvent(new Event(SEARCH_RADIUS_STORAGE_CHANGE_EVENT));
}
