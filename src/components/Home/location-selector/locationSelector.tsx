"use client";

import type { LocationSelectorValue } from "@/type/home";
import styles from "./locationSelector.module.css";
import { useEffect } from "react";

type LocationSelectorButtonProps = {
  label: string;
  onClick: () => void;
  selected?: boolean;
};

function LocationSelectorButton({
  label,
  onClick,
  selected = false,
}: LocationSelectorButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${selected ? styles.selected : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

type LocationSelectorProps = {
  onSelect: (value: LocationSelectorValue) => void;
  selectedLocation: LocationSelectorValue;
};

export function LocationSelector({
  onSelect,
  selectedLocation,
}: LocationSelectorProps) {
  useEffect(() => {}, []);

  return (
    <div className={styles.row} aria-label="위치 설정 선택지">
      <LocationSelectorButton
        label="현재 위치: 성수동"
        selected={selectedLocation === "seongsu"}
        onClick={() => onSelect("seongsu")}
      />
      <LocationSelectorButton
        label="현재 내 위치로 위치하기"
        selected={selectedLocation === "my-location"}
        onClick={() => onSelect("my-location")}
      />
      <LocationSelectorButton
        label="지도에서 위치 설정"
        selected={selectedLocation === "map-location"}
        onClick={() => onSelect("map-location")}
      />
    </div>
  );
}
