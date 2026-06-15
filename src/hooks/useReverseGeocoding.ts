"use client";

import { useCallback, useEffect, useState } from "react";
import useCurrentCoordinates, { type Coordinates } from "./useCurrentCoordinates";
import { httpClient } from "@/api/httpClient";

type ReverseLocationResponse = {
  regionName: string | null;
};

type UseReverseGeocodingResult = {
  coords: Coordinates | null;
  errorMessage: string | null;
  isLoading: boolean;
  region: string | null;
  refetch: () => Promise<void>;
};

const useReverseGeocoding = (): UseReverseGeocodingResult => {
  const {
    coords,
    errorMessage: coordinateErrorMessage,
    isLoading: isLoadingCoordinates,
    refetch: refetchCoordinates,
  } = useCurrentCoordinates();
  const [region, setRegion] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingRegion, setIsLoadingRegion] = useState(false);

  const fetchRegion = useCallback(async (currentCoords: Coordinates) => {
    try {
      setIsLoadingRegion(true);
      setErrorMessage(null);

      const data = await httpClient.get<ReverseLocationResponse>(
        "/api/reverse-location",
        {
          params: {
            lat: currentCoords.latitude,
            lng: currentCoords.longitude,
          },
        },
      );

      setRegion(data.regionName ?? null);
    } catch {
      setRegion(null);
      setErrorMessage("현재 위치의 지역 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoadingRegion(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    try {
      const latestCoords = await refetchCoordinates();
      await fetchRegion(latestCoords);
    } catch {
      setRegion(null);
    }
  }, [fetchRegion, refetchCoordinates]);

  useEffect(() => {
    if (!coords) {
      if (!isLoadingCoordinates) {
        setRegion(null);
      }

      return;
    }

    void fetchRegion(coords);
  }, [coords, fetchRegion, isLoadingCoordinates]);

  return {
    coords,
    errorMessage: coordinateErrorMessage ?? errorMessage,
    isLoading: isLoadingCoordinates || isLoadingRegion,
    region,
    refetch,
  };
};

export default useReverseGeocoding;
