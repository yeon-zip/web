"use client";

const SELECTED_LOCATION_STORAGE_KEY = "selected-location";
export const LOCATION_STORAGE_CHANGE_EVENT = "polarstar-location-storage-change";

export type StoredSelectedLocationSource = "current" | "manual";

export type StoredSelectedLocation = {
  label: string;
  latitude: number | null;
  longitude: number | null;
  source: StoredSelectedLocationSource;
};

function isValidCoordinate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseStoredSelectedLocation(
  rawValue: string | null,
): StoredSelectedLocation | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredSelectedLocation>;

    if (
      typeof parsedValue.label !== "string" ||
      (parsedValue.source !== "current" && parsedValue.source !== "manual")
    ) {
      return null;
    }

    return {
      label: parsedValue.label,
      latitude: isValidCoordinate(parsedValue.latitude)
        ? parsedValue.latitude
        : null,
      longitude: isValidCoordinate(parsedValue.longitude)
        ? parsedValue.longitude
        : null,
      source: parsedValue.source,
    };
  } catch {
    return {
      label: rawValue,
      latitude: null,
      longitude: null,
      source: "manual",
    };
  }
}

export function getStoredSelectedLocationPreference() {
  if (typeof window === "undefined") {
    return null;
  }

  return parseStoredSelectedLocation(
    window.localStorage.getItem(SELECTED_LOCATION_STORAGE_KEY),
  );
}

export function getStoredSelectedLocation() {
  return getStoredSelectedLocationPreference()?.label ?? null;
}

export function setStoredSelectedLocation(location: StoredSelectedLocation) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    SELECTED_LOCATION_STORAGE_KEY,
    JSON.stringify(location),
  );
  window.dispatchEvent(new Event(LOCATION_STORAGE_CHANGE_EVENT));
}
