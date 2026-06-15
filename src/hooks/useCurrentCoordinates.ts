// 브라우저 API인 geolocation을 활용하여 사용자의 위도, 경도 좌표를 불러온다.
"use client";

import { useCallback, useEffect, useState } from "react";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type UseCurrentCoordinatesResult = {
  coords: Coordinates | null;
  errorMessage: string | null;
  isLoading: boolean;
  refetch: () => Promise<Coordinates>;
};

type UseCurrentCoordinatesOptions = {
  enabled?: boolean;
};

function getGeolocationErrorMessage(error: GeolocationPositionError) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "위치 권한이 거부되었습니다. 브라우저에서 위치 접근을 허용해 주세요.";
    case error.POSITION_UNAVAILABLE:
      return "현재 위치 정보를 가져오지 못했습니다.";
    case error.TIMEOUT:
      return "위치 확인 시간이 초과되었습니다. 다시 시도해 주세요.";
    default:
      return "현재 위치를 확인하지 못했습니다.";
  }
}

const useCurrentCoordinates = ({
  enabled = true,
}: UseCurrentCoordinatesOptions = {}): UseCurrentCoordinatesResult => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);

  const refetch = useCallback(() => {
    if (!("geolocation" in navigator)) {
      const error = new Error("이 브라우저는 위치 정보를 지원하지 않습니다.");
      setCoords(null);
      setErrorMessage(error.message);
      setIsLoading(false);
      console.error(error.message);
      return Promise.reject(error);
    }

    setIsLoading(true);
    setErrorMessage(null);

    return new Promise<Coordinates>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nextCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setCoords(nextCoords);
          setErrorMessage(null);
          setIsLoading(false);
          resolve(nextCoords);
        },
        (error) => {
          setCoords(null);
          setErrorMessage(getGeolocationErrorMessage(error));
          setIsLoading(false);
          reject(error);
        },
      );
    });
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timerId = window.setTimeout(() => {
      void refetch().catch(() => undefined);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [enabled, refetch]);

  return {
    coords,
    errorMessage,
    isLoading,
    refetch,
  };
};

export default useCurrentCoordinates;
