"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { httpClient } from "@/api/httpClient";
import useCurrentCoordinates from "@/hooks/useCurrentCoordinates";
import {
  loadKakaoMapSdk,
  type KakaoMap,
  type KakaoMarker,
} from "@/lib/kakaoMapSdk";
import type { SelectedLocationOption } from "./locationSelectorModal";
import styles from "./locationSelectorModal.module.css";

type LocationMapPickerProps = {
  initialLocation: SelectedLocationOption | null;
  onSelectLocation: (location: SelectedLocationOption) => void;
};

type ReverseLocationResponse = {
  regionName: string | null;
};

const DEFAULT_CENTER = {
  label: "서울 중구",
  latitude: 37.5666805,
  longitude: 126.9784147,
};

function formatCoordinateLabel(latitude: number, longitude: number) {
  return `선택 위치 (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
}

export function LocationMapPicker({
  initialLocation,
  onSelectLocation,
}: LocationMapPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const requestIdRef = useRef(0);
  const [pickedLocation, setPickedLocation] =
    useState<SelectedLocationOption | null>(
      initialLocation ?? DEFAULT_CENTER,
    );
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [currentLocationErrorMessage, setCurrentLocationErrorMessage] =
    useState("");
  const {
    errorMessage: currentCoordinateErrorMessage,
    isLoading: isLoadingCurrentLocation,
    refetch: refetchCurrentCoordinates,
  } = useCurrentCoordinates({ enabled: false });

  const center = useMemo(
    () => initialLocation ?? DEFAULT_CENTER,
    [initialLocation],
  );

  const movePicker = (latitude: number, longitude: number) => {
    if (!window.kakao?.maps || !mapRef.current || !markerRef.current) {
      return;
    }

    const nextPosition = new window.kakao.maps.LatLng(latitude, longitude);
    mapRef.current.setCenter(nextPosition);
    markerRef.current.setPosition(nextPosition);
    void updatePickedLocation(latitude, longitude);
  };

  const updatePickedLocation = async (latitude: number, longitude: number) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const fallbackLabel = formatCoordinateLabel(latitude, longitude);

    setPickedLocation({
      label: fallbackLabel,
      latitude,
      longitude,
    });

    try {
      const data = await httpClient.get<ReverseLocationResponse>(
        "/api/reverse-location",
        {
          params: {
            lat: latitude,
            lng: longitude,
          },
        },
      );

      if (requestIdRef.current !== requestId) {
        return;
      }

      setPickedLocation({
        label: data.regionName ?? fallbackLabel,
        latitude,
        longitude,
      });
    } catch {
      if (requestIdRef.current === requestId) {
        setPickedLocation({
          label: fallbackLabel,
          latitude,
          longitude,
        });
      }
    }
  };

  const handleMoveToCurrentLocation = async () => {
    try {
      setCurrentLocationErrorMessage("");
      const nextCoords = await refetchCurrentCoordinates();
      movePicker(nextCoords.latitude, nextCoords.longitude);
    } catch {
      setCurrentLocationErrorMessage(
        currentCoordinateErrorMessage ??
          "현재 위치를 확인하지 못했습니다. 위치 권한을 확인해 주세요.",
      );
    }
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let isMounted = true;

    loadKakaoMapSdk()
      .then((kakao) => {
        if (!isMounted || !containerRef.current) {
          return;
        }

        const centerLatLng = new kakao.maps.LatLng(
          center.latitude,
          center.longitude,
        );

        if (!mapRef.current) {
          mapRef.current = new kakao.maps.Map(containerRef.current, {
            center: centerLatLng,
            level: 5,
          });
          markerRef.current = new kakao.maps.Marker({
            position: centerLatLng,
            map: mapRef.current,
            draggable: true,
          });

          kakao.maps.event.addListener(markerRef.current, "dragend", () => {
            if (!markerRef.current) {
              return;
            }

            const nextPosition = markerRef.current.getPosition();
            mapRef.current?.setCenter(nextPosition);
            void updatePickedLocation(
              nextPosition.getLat(),
              nextPosition.getLng(),
            );
          });
        } else {
          mapRef.current.setCenter(centerLatLng);
          markerRef.current?.setPosition(centerLatLng);
        }

        mapRef.current.relayout();
        void updatePickedLocation(center.latitude, center.longitude);
        setStatus("ready");
      })
      .catch((error: Error) => {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(error.message);
        }
      });

    return () => {
      isMounted = false;
      markerRef.current?.setMap(null);
    };
  }, [center.latitude, center.longitude]);

  return (
    <section className={styles.mapPicker}>
      <div className={styles.mapFrame}>
        <div ref={containerRef} className={styles.mapCanvas} />
        {status !== "ready" ? (
          <div className={styles.mapOverlay}>
            {status === "loading"
              ? "지도를 불러오는 중입니다..."
              : errorMessage || "지도를 표시하지 못했어요."}
          </div>
        ) : null}
      </div>

      <div className={styles.mapSelectionBar}>
        <div className={styles.mapSelectionText}>
          <span className={styles.mapSelectionLabel}>선택 위치</span>
          <strong>
            {pickedLocation?.label ?? "위치를 선택할 수 없습니다."}
          </strong>
        </div>
        <div className={styles.mapActions}>
          <button
            type="button"
            className={styles.currentLocationButton}
            disabled={status !== "ready" || isLoadingCurrentLocation}
            onClick={handleMoveToCurrentLocation}
          >
            {isLoadingCurrentLocation ? "확인 중" : "현재 위치로 설정"}
          </button>
          <button
            type="button"
            className={styles.selectMapButton}
            disabled={!pickedLocation || status !== "ready"}
            onClick={() => {
              if (pickedLocation) {
                onSelectLocation(pickedLocation);
              }
            }}
          >
            이 위치로 설정
          </button>
        </div>
      </div>

      {currentLocationErrorMessage ? (
        <p className={styles.feedbackError}>{currentLocationErrorMessage}</p>
      ) : null}
    </section>
  );
}
