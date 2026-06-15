"use client";

import { useQuery } from "@tanstack/react-query";
import { getNearbyBookAvailability } from "@/api/getNearbyBookAvailability";
import useSelectedCoordinates from "@/hooks/useSelectedCoordinates";
import { HomeSearchRadiusKm } from "@/type/radius";
import type {
  GetNearbyBookAvailabilityResponse,
  SearchResultLibrary,
} from "@/type/search";
import { SearchResultLibraryCard } from "./searchResultLibraryCard";
import styles from "./searchResultLibraryList.module.css";

type SearchResultLibraryListProps = {
  availabilityOnly: boolean;
  bookTitle: string;
  isbn: string | null;
  selectedRadiusKm: HomeSearchRadiusKm;
};

function mapAvailabilityLibraryToSearchResultLibrary(
  bookTitle: string,
  isbn: string | null,
  library: GetNearbyBookAvailabilityResponse["items"][number],
): SearchResultLibrary {
  return {
    isbn,
    bookTitle,
    distanceMeters: Math.round(library.distanceKm * 1000),
    holdingStatus: library.loanAvailable
      ? "도서 보유 · 대출 가능"
      : "도서 보유 · 대출 불가",
    holidayInfo: "휴관 정보 준비 중",
    libraryId: String(library.libraryId),
    libraryName: library.name,
    loanStatus: library.loanAvailable ? "대출 가능" : "대출 불가",
    location: library.address,
    operatingHours: "운영시간 정보 준비 중",
    operatingStatus: library.openNow ? "운영중" : "운영 종료",
    bookmarked: library.bookmarked,
  };
}

export function SearchResultLibraryList({
  availabilityOnly,
  bookTitle,
  isbn,
  selectedRadiusKm,
}: SearchResultLibraryListProps) {
  const {
    coords,
    errorMessage: coordinatesErrorMessage,
    isLoading: isLoadingCoordinates,
  } = useSelectedCoordinates();
  const trimmedBookTitle = bookTitle.trim();

  const availabilityQuery = useQuery({
    queryKey: [
      "libraries",
      "book-availability",
      isbn,
      coords?.latitude,
      coords?.longitude,
      selectedRadiusKm,
      availabilityOnly,
    ],
    queryFn: () => {
      if (!isbn || !coords) {
        throw new Error("도서관 목록을 조회하는 데 필요한 정보가 부족합니다.");
      }

      return getNearbyBookAvailability({
        isbn,
        latitude: coords.latitude,
        longitude: coords.longitude,
        radiusKm: selectedRadiusKm,
        loanAvailable: availabilityOnly || undefined,
      });
    },
    enabled: Boolean(isbn && coords),
  });

  const libraries = (availabilityQuery.data?.items ?? []).map((library) =>
    mapAvailabilityLibraryToSearchResultLibrary(trimmedBookTitle, isbn, library),
  );

  if (!trimmedBookTitle) {
    return (
      <section className={styles.panel} aria-label="검색 결과 도서관 목록">
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <span className={styles.badge}>거리순 소장 도서관 리스트</span>
            <h2 className={styles.title}>보유 도서관</h2>
          </div>

          <p className={styles.description}>
            검색어를 입력하면 해당 도서를 보유한 도서관을 보여드릴게요.
          </p>
        </div>
      </section>
    );
  }

  if (!isbn) {
    return (
      <section className={styles.panel} aria-label="검색 결과 도서관 목록">
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <span className={styles.badge}>거리순 소장 도서관 리스트</span>
            <h2 className={styles.title}>
              &quot;{trimmedBookTitle}&quot; 보유 도서관
            </h2>
          </div>

          <p className={styles.description}>
            먼저 위 도서 목록에서 조회할 책을 선택해주세요.
          </p>
        </div>
      </section>
    );
  }

  if (isLoadingCoordinates) {
    return (
      <section className={styles.panel} aria-label="검색 결과 도서관 목록">
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <span className={styles.badge}>거리순 소장 도서관 리스트</span>
            <h2 className={styles.title}>
              &quot;{trimmedBookTitle}&quot; 보유 도서관
            </h2>
          </div>

          <p className={styles.description}>
            선택한 위치 정보를 확인한 뒤 주변 도서관을 불러오고 있어요.
          </p>
        </div>
      </section>
    );
  }

  if (!coords) {
    return (
      <section className={styles.panel} aria-label="검색 결과 도서관 목록">
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <span className={styles.badge}>거리순 소장 도서관 리스트</span>
            <h2 className={styles.title}>
              &quot;{trimmedBookTitle}&quot; 보유 도서관
            </h2>
          </div>

          <p className={styles.description}>
            {coordinatesErrorMessage ??
              "선택한 위치를 확인하지 못해 주변 도서관을 불러올 수 없어요."}
          </p>
        </div>
      </section>
    );
  }

  if (availabilityQuery.isLoading) {
    return (
      <section className={styles.panel} aria-label="검색 결과 도서관 목록">
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <span className={styles.badge}>거리순 소장 도서관 리스트</span>
            <h2 className={styles.title}>
              &quot;{trimmedBookTitle}&quot; 보유 도서관
            </h2>
          </div>

          <p className={styles.description}>
            선택한 위치 기준으로 소장 도서관을 조회하고 있어요.
          </p>
        </div>
      </section>
    );
  }

  if (availabilityQuery.isError) {
    return (
      <section className={styles.panel} aria-label="검색 결과 도서관 목록">
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <span className={styles.badge}>거리순 소장 도서관 리스트</span>
            <h2 className={styles.title}>
              &quot;{trimmedBookTitle}&quot; 보유 도서관
            </h2>
          </div>

          <p className={styles.description}>
            도서관 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        </div>
      </section>
    );
  }

  if (libraries.length === 0) {
    return (
      <section className={styles.panel} aria-label="검색 결과 도서관 목록">
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <span className={styles.badge}>거리순 소장 도서관 리스트</span>
            <h2 className={styles.title}>
              &quot;{trimmedBookTitle}&quot; 보유 도서관
            </h2>
          </div>

          <p className={styles.description}>
            선택한 반경 안에서 이 도서를 보유한 도서관을 찾지 못했어요.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-label="검색 결과 도서관 목록">
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <span className={styles.badge}>거리순 소장 도서관 리스트</span>
          <h2 className={styles.title}>
            &quot;{trimmedBookTitle}&quot; 보유 도서관
          </h2>
        </div>
      </div>

      <div className={styles.list}>
        {libraries.map((library) => (
          <SearchResultLibraryCard key={library.libraryId} library={library} />
        ))}
      </div>
    </section>
  );
}
