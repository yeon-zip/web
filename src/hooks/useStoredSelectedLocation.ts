"use client";

import { useEffect, useState } from "react";
import {
  getStoredSelectedLocationPreference,
  LOCATION_STORAGE_CHANGE_EVENT,
  type StoredSelectedLocation,
} from "@/lib/locationStorage";

const useStoredSelectedLocation = () => {
  const [selectedLocation, setSelectedLocation] =
    useState<StoredSelectedLocation | null>(null);

  useEffect(() => {
    const syncSelectedLocation = () => {
      setSelectedLocation(getStoredSelectedLocationPreference());
    };

    syncSelectedLocation();
    window.addEventListener("storage", syncSelectedLocation);
    window.addEventListener(LOCATION_STORAGE_CHANGE_EVENT, syncSelectedLocation);

    return () => {
      window.removeEventListener("storage", syncSelectedLocation);
      window.removeEventListener(
        LOCATION_STORAGE_CHANGE_EVENT,
        syncSelectedLocation,
      );
    };
  }, []);

  return selectedLocation;
};

export default useStoredSelectedLocation;
