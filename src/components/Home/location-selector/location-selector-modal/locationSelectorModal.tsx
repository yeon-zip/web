"use client";

import { FormEvent, useState } from "react";
import styles from "./locationSelectorModal.module.css";
import { Modal } from "@/components/Modal/modal";
import { httpClient } from "@/api/httpClient";
import {
  AddressSearchResult,
  SearchAddressResponse,
} from "@/type/location/locationSearch";
import { LocationMapPicker } from "./locationMapPicker";

export type SelectedLocationOption = {
  label: string;
  latitude: number;
  longitude: number;
};

type LocationSelectorModalProps = {
  isOpen: boolean;
  initialLocation: SelectedLocationOption | null;
  onClose: () => void;
  onSelectLocation: (location: SelectedLocationOption) => void;
};

export function LocationSelectorModal({
  isOpen,
  initialLocation,
  onClose,
  onSelectLocation,
}: LocationSelectorModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setErrorMessage("검색할 주소를 입력해 주세요.");
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setHasSearched(true);

    try {
      const data = await httpClient.get<SearchAddressResponse>(
        "/api/search-address",
        {
          params: {
            query: trimmedQuery,
          },
        },
      );

      setResults(data.documents ?? []);
    } catch {
      setResults([]);
      setErrorMessage(
        "주소를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="지도와 주소로 위치를 변경할 수 있습니다"
      description="지도 핀을 옮기거나 도로명 주소와 지번으로 검색할 수 있어요."
      onClose={onClose}
    >
      <>
        <LocationMapPicker
          initialLocation={initialLocation}
          onSelectLocation={onSelectLocation}
        />

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <label htmlFor="address-search" className={styles.label}>
            주소 검색
          </label>
          <div className={styles.searchRow}>
            <input
              id="address-search"
              className={styles.input}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="예: 서울 성동구 성수동2가"
            />
            <button type="submit" className={styles.searchButton}>
              검색
            </button>
          </div>
        </form>

        {errorMessage ? (
          <p className={styles.feedbackError}>{errorMessage}</p>
        ) : null}
        {isLoading ? (
          <p className={styles.feedback}>주소를 찾는 중입니다...</p>
        ) : null}
        {!isLoading && hasSearched && results.length === 0 && !errorMessage ? (
          <p className={styles.feedback}>
            검색 결과가 없습니다. 다른 주소로 시도해 보세요.
          </p>
        ) : null}

        <div className={styles.resultList} aria-live="polite">
          {results.map((result) => (
            <button
              key={`${result.addressName}-${result.longitude}-${result.latitude}`}
              type="button"
              className={styles.resultItem}
              onClick={() =>
                onSelectLocation({
                  label: result.roadAddressName ?? result.addressName,
                  latitude: Number(result.latitude),
                  longitude: Number(result.longitude),
                })
              }
            >
              <strong className={styles.primaryAddress}>
                {result.roadAddressName ?? result.addressName}
              </strong>
              <span className={styles.secondaryAddress}>
                {result.lotNumberAddressName ?? result.addressName}
              </span>
            </button>
          ))}
        </div>
      </>
    </Modal>
  );
}
