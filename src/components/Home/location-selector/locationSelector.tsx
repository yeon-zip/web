"use client";

import styles from "./locationSelector.module.css";
import { useEffect, useState } from "react";
import { LocationSelectorButton } from "./location-selector-button/locationSelectorButton";
import useReverseGeocoding from "@/hooks/useReverseGeocoding";
import {
  LocationSelectorModal,
  type SelectedLocationOption,
} from "./location-selector-modal/locationSelectorModal";
import {
  getStoredSelectedLocationPreference,
  setStoredSelectedLocation,
} from "@/lib/locationStorage";

const LocationSelector = () => {
  const { coords, errorMessage, isLoading, region, refetch } =
    useReverseGeocoding();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocationOption | null>(() => {
      const storedLocation = getStoredSelectedLocationPreference();

      if (
        storedLocation?.source !== "manual" ||
        typeof storedLocation.latitude !== "number" ||
        typeof storedLocation.longitude !== "number"
      ) {
        return null;
      }

      return {
        label: storedLocation.label,
        latitude: storedLocation.latitude,
        longitude: storedLocation.longitude,
      };
    });
  const currentLocation = selectedLocation?.label ?? region ?? null;
  const mapInitialLocation =
    selectedLocation ??
    (region && coords
      ? {
          label: region,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }
      : null);

  useEffect(() => {
    if (selectedLocation) {
      setStoredSelectedLocation({
        label: selectedLocation.label,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        source: "manual",
      });
      return;
    }

    if (!region || !coords) {
      return;
    }

    setStoredSelectedLocation({
      label: region,
      latitude: coords.latitude,
      longitude: coords.longitude,
      source: "current",
    });
  }, [coords, region, selectedLocation]);

  const setNowLocation = async () => {
    setSelectedLocation(null);
    await refetch();
  };

  const changeLocation = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.row} aria-label="위치 설정 선택지">
        <LocationSelectorButton
          label={`선택 위치: ${
            currentLocation ?? (isLoading ? "위치 확인 중" : "위치를 확인할 수 없음")
          }`}
        />
        <LocationSelectorButton
          label="현재 위치로 설정"
          onClick={setNowLocation}
        />
        <LocationSelectorButton
          label="지도에서 위치 설정"
          onClick={changeLocation}
        />
      </div>
      {!currentLocation && !isLoading && errorMessage ? (
        <p className={styles.feedback}>{errorMessage}</p>
      ) : null}
      <LocationSelectorModal
        isOpen={isModalOpen}
        initialLocation={mapInitialLocation}
        onClose={() => setIsModalOpen(false)}
        onSelectLocation={(location) => {
          setSelectedLocation(location);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default LocationSelector;
