"use client";

import { useEffect, useState } from "react";
import { getNearbyLibrarys } from "@/api/getNearbyLibraries";
import { Modal } from "@/components/Modal/modal";
import useSelectedCoordinates from "@/hooks/useSelectedCoordinates";
import { filterOperatingLibraries } from "@/lib/filterOperatingLibraries";
import { HomeSearchRadiusKm } from "@/type/radius";
import type { NearbyLibraryItem } from "@/type/search";
import styles from "./openLibraryModal.module.css";

type OpenLibraryModalProps = {
  onClose: () => void;
  selectedRadius: HomeSearchRadiusKm;
};

export function OpenLibraryModal({
  onClose,
  selectedRadius,
}: OpenLibraryModalProps) {
  const {
    coords,
    errorMessage: coordinatesErrorMessage,
    isLoading: isLoadingCoordinates,
  } = useSelectedCoordinates();
  const [libraries, setLibraries] = useState<NearbyLibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!coords) {
      return;
    }

    let isMounted = true;

    const loadOpenLibraries = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await getNearbyLibrarys({
          latitude: coords.latitude,
          longitude: coords.longitude,
          radiusKm: selectedRadius,
          limit: 20,
        });

        if (!isMounted) {
          return;
        }

        setLibraries(filterOperatingLibraries(data.items));
      } catch {
        if (!isMounted) {
          return;
        }

        setLibraries([]);
        setErrorMessage("운영 중인 도서관 목록을 불러오지 못했어요.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadOpenLibraries();

    return () => {
      isMounted = false;
    };
  }, [coords, selectedRadius]);

  return (
    <Modal
      title="현재 운영 중인 도서관을 확인할 수 있어요"
      description="지금 시점에 운영 중인 도서관 수만 따로 확인할 수 있습니다."
      onClose={onClose}
    >
      <div className={styles.metricCard}>
        <span className={styles.label}>운영 중인 도서관</span>
        <strong className={styles.value}>{libraries.length}곳</strong>
        <p className={styles.description}>
          선택한 위치와 {selectedRadius}km 반경 기준으로 운영 중인 도서관만
          보여드려요.
        </p>
      </div>

      {isLoadingCoordinates ? (
        <p className={styles.feedback}>선택한 위치를 확인하는 중입니다...</p>
      ) : null}
      {!isLoadingCoordinates && !coords ? (
        <p className={styles.error}>
          {coordinatesErrorMessage ?? "선택한 위치를 확인하지 못했어요."}
        </p>
      ) : null}
      {coords !== null && isLoading ? (
        <p className={styles.feedback}>
          운영 중인 도서관 목록을 불러오는 중입니다...
        </p>
      ) : null}
      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
      {!isLoading && !errorMessage && libraries.length === 0 ? (
        <p className={styles.feedback}>
          선택한 반경 안에서 현재 운영 중인 도서관이 없어요.
        </p>
      ) : null}

      {libraries.length > 0 ? (
        <div className={styles.list}>
          {libraries.map((library) => (
            <article key={library.libraryId} className={styles.listItem}>
              <div className={styles.itemHeader}>
                <strong className={styles.itemTitle}>{library.name}</strong>
                <span className={`${styles.statusChip} ${styles.statusOpen}`}>
                  운영중
                </span>
              </div>
              <p className={styles.itemAddress}>{library.address}</p>
              <div className={styles.metaRow}>
                <span>{library.distanceKm.toFixed(1)}km</span>
                {library.tel ? <span>{library.tel}</span> : null}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </Modal>
  );
}
