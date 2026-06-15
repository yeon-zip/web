"use client";

import { useCallback, useMemo } from "react";
import useCurrentCoordinates, { type Coordinates } from "./useCurrentCoordinates";
import useStoredSelectedLocation from "./useStoredSelectedLocation";
import type { StoredSelectedLocation } from "@/lib/locationStorage";

type UseSelectedCoordinatesResult = {
  coords: Coordinates | null;
  errorMessage: string | null;
  isLoading: boolean;
  refetch: () => Promise<Coordinates>;
};

function hasStoredCoordinates(
  location: StoredSelectedLocation | null,
): location is StoredSelectedLocation & {
  latitude: number;
  longitude: number;
} {
  return (
    location !== null &&
    typeof location.latitude === "number" &&
    typeof location.longitude === "number"
  );
}

const useSelectedCoordinates = (): UseSelectedCoordinatesResult => {
  const selectedLocation = useStoredSelectedLocation();
  const shouldUseManualCoordinates =
    selectedLocation?.source === "manual" && hasStoredCoordinates(selectedLocation);
  const storedCoords = useMemo(() => {
    if (!hasStoredCoordinates(selectedLocation)) {
      return null;
    }

    return {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    };
  }, [selectedLocation]);
  const {
    coords: currentCoords,
    errorMessage: currentErrorMessage,
    isLoading: isLoadingCurrentCoordinates,
    refetch: refetchCurrentCoordinates,
  } = useCurrentCoordinates({ enabled: !shouldUseManualCoordinates });
  const refetchStoredCoords = useCallback(() => {
    if (!storedCoords) {
      return Promise.reject(new Error("저장된 위치 좌표가 없습니다."));
    }

    return Promise.resolve(storedCoords);
  }, [storedCoords]);

  if (shouldUseManualCoordinates && storedCoords) {
    return {
      coords: storedCoords,
      errorMessage: null,
      isLoading: false,
      refetch: refetchStoredCoords,
    };
  }

  const resolvedCoords = currentCoords ?? storedCoords;

  return {
    coords: resolvedCoords,
    errorMessage: resolvedCoords ? null : currentErrorMessage,
    isLoading: isLoadingCurrentCoordinates,
    refetch: refetchCurrentCoordinates,
  };
};

export default useSelectedCoordinates;
