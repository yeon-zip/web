"use client";

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { getNearbyLibrarys } from "@/api/getNearbyLibraries";
import useSelectedCoordinates from "@/hooks/useSelectedCoordinates";
import { filterOperatingLibraries } from "@/lib/filterOperatingLibraries";
import { getStoredSearchRadius, setStoredSearchRadius } from "@/lib/searchRadiusStorage";
import type { NearbyLibraryItem } from "@/type/search";
import { HomeSearchRadiusKm } from "@/type/radius";
import { SummaryCard } from "./summaryCard";
import { NearbyLibraryModal } from "./nearby-library-modal/nearbyLibraryModal";
import { OpenLibraryModal } from "./open-library-modal/openLibraryModal";
import { RadiusModal } from "./radius-modal/radiusModal";
import styles from "./summaryCards.module.css";

function formatRadius(radius: HomeSearchRadiusKm) {
  return `${radius}km`;
}

export function SummaryCards() {
  const {
    coords,
    errorMessage: coordinatesErrorMessage,
    isLoading: isLoadingCoordinates,
  } = useSelectedCoordinates();
  const [searchRadius, setSearchRadius] = useState<HomeSearchRadiusKm>(
    getStoredSearchRadius() ?? HomeSearchRadiusKm.TWO,
  );
  const [libraries, setLibraries] = useState<NearbyLibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [isRadiusModalOpen, setIsRadiusModalOpen] = useState(false);
  const [isNearbyLibraryModalOpen, setIsNearbyLibraryModalOpem] =
    useState(false);
  const [isActiveLibraryModalOpen, setIsActiveLibraryModalOpen] =
    useState(false);

  useEffect(() => {
    if (!coords) {
      if (!isLoadingCoordinates) {
        setIsLoading(false);
      }

      return;
    }

    let isMounted = true;

    const loadLibraries = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const data = await getNearbyLibrarys({
          latitude: coords.latitude,
          longitude: coords.longitude,
          radiusKm: searchRadius,
          limit: 20,
        });

        if (!isMounted) {
          return;
        }

        setLibraries(data.items);
      } catch {
        if (!isMounted) {
          return;
        }

        setLibraries([]);
        setIsError(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadLibraries();

    return () => {
      isMounted = false;
    };
  }, [coords, isLoadingCoordinates, searchRadius]);

  useEffect(() => {
    setStoredSearchRadius(searchRadius);
  }, [searchRadius]);

  const nearbyLibraryCount = libraries.length;
  const openLibraryCount = filterOperatingLibraries(libraries).length;

  if (isLoadingCoordinates) {
    return (
      <div
        className={styles.loading}
        role="status"
        aria-label="요약 정보 불러오는 중"
      >
        <ClipLoader color="#3151e5" size={34} />
      </div>
    );
  }

  if (!coords) {
    return (
      <div className={styles.loading}>
        <p className={styles.error}>
          {coordinatesErrorMessage ?? "현재 위치를 확인하지 못했어요."}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={styles.loading}
        role="status"
        aria-label="요약 정보 불러오는 중"
      >
        <ClipLoader color="#3151e5" size={34} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.loading}>
        <p className={styles.error}>요약 정보를 불러오지 못했어요.</p>
      </div>
    );
  }

  const changeSearchRadius = () => {
    setIsRadiusModalOpen(true);
  };

  const checkNearbyLibraries = () => {
    setIsNearbyLibraryModalOpem(true);
  };

  const checkOpenLibraries = () => {
    setIsActiveLibraryModalOpen(true);
  };

  return (
    <>
      <div className={styles.grid}>
        <SummaryCard
          label="검색반경"
          description="선택한 반경 안에서 가까운 도서관을 탐색해요"
          onClick={changeSearchRadius}
          value={formatRadius(searchRadius)}
        />
        <SummaryCard
          label="주변도서관"
          description="선택한 위치에서 바로 확인 가능한 도서관 수예요"
          onClick={checkNearbyLibraries}
          value={`${nearbyLibraryCount}곳`}
        />
        <SummaryCard
          label="운영중"
          description="지금 바로 방문 가능한 도서관만 따로 모았어요"
          onClick={checkOpenLibraries}
          value={`${openLibraryCount}곳`}
        />
      </div>
      {isRadiusModalOpen ? (
        <RadiusModal
          selectedRadius={searchRadius}
          onClose={() => setIsRadiusModalOpen(false)}
          onSelectRadius={setSearchRadius}
        />
      ) : null}
      {isNearbyLibraryModalOpen ? (
        <NearbyLibraryModal
          onClose={() => setIsNearbyLibraryModalOpem(false)}
          selectedRadius={searchRadius}
        />
      ) : null}
      {isActiveLibraryModalOpen ? (
        <OpenLibraryModal
          selectedRadius={searchRadius}
          onClose={() => setIsActiveLibraryModalOpen(false)}
        />
      ) : null}
    </>
  );
}
