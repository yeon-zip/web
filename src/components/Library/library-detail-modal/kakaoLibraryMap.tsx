"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  loadKakaoMapSdk,
  type KakaoMap,
  type KakaoMarker,
} from "@/lib/kakaoMapSdk";
import styles from "./kakaoLibraryMap.module.css";

type KakaoLibraryMapProps = {
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
};

type ResolvedCoordinates = {
  latitude: number;
  longitude: number;
};

function isValidCoordinate(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

function getInitialCoordinates(
  latitude?: number | null,
  longitude?: number | null,
): ResolvedCoordinates | null {
  if (!isValidCoordinate(latitude) || !isValidCoordinate(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

async function searchCoordinatesByAddress(address: string) {
  const response = await fetch(
    `/api/search-address?query=${encodeURIComponent(address)}`,
  );

  if (!response.ok) {
    throw new Error("주소로 좌표를 찾지 못했어요.");
  }

  const data = await response.json();
  const firstDocument = data.documents?.[0];
  const latitude = Number(firstDocument?.latitude);
  const longitude = Number(firstDocument?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("주소로 좌표를 찾지 못했어요.");
  }

  return { latitude, longitude };
}

export function KakaoLibraryMap({
  name,
  address,
  latitude,
  longitude,
}: KakaoLibraryMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const initialCoordinates = useMemo(
    () => getInitialCoordinates(latitude, longitude),
    [latitude, longitude],
  );
  const [searchedCoordinates, setSearchedCoordinates] =
    useState<ResolvedCoordinates | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const coordinates = initialCoordinates ?? searchedCoordinates;

  const mapLink = useMemo(() => {
    if (!coordinates) {
      return null;
    }

    return `https://map.kakao.com/link/map/${encodeURIComponent(name)},${coordinates.latitude},${coordinates.longitude}`;
  }, [coordinates, name]);

  useEffect(() => {
    if (initialCoordinates) {
      return;
    }

    let isMounted = true;

    searchCoordinatesByAddress(address)
      .then((nextCoordinates) => {
        if (isMounted) {
          setSearchedCoordinates(nextCoordinates);
        }
      })
      .catch((error: Error) => {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(error.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [address, initialCoordinates]);

  useEffect(() => {
    if (!coordinates || !containerRef.current) {
      return;
    }

    let isMounted = true;
    loadKakaoMapSdk()
      .then((kakao) => {
        if (!isMounted || !containerRef.current) {
          return;
        }

        const position = new kakao.maps.LatLng(
          coordinates.latitude,
          coordinates.longitude,
        );

        if (!mapRef.current) {
          mapRef.current = new kakao.maps.Map(containerRef.current, {
            center: position,
            level: 3,
          });
        } else {
          mapRef.current.setCenter(position);
        }

        markerRef.current?.setMap(null);
        markerRef.current = new kakao.maps.Marker({
          position,
          map: mapRef.current,
        });
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
  }, [coordinates]);

  return (
    <section className={styles.mapSection} aria-label={`${name} 위치 지도`}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.title}>위치</h4>
          <p className={styles.address}>{address}</p>
        </div>
        {mapLink ? (
          <a
            className={styles.mapLink}
            href={mapLink}
            target="_blank"
            rel="noreferrer"
          >
            카카오맵
          </a>
        ) : null}
      </div>

      <div className={styles.mapFrame}>
        <div ref={containerRef} className={styles.map} />
        {status !== "ready" ? (
          <div className={styles.overlay}>
            {status === "loading"
              ? "지도를 불러오는 중입니다..."
              : errorMessage || "지도를 표시하지 못했어요."}
          </div>
        ) : null}
      </div>
    </section>
  );
}
