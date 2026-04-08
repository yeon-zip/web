"use client";

import {
  SearchResultLibraryCard,
  type SearchResultLibrary,
} from "./searchResultLibraryCard";
import styles from "./searchResultLibraryList.module.css";

const SEARCH_RESULT_LIBRARIES: SearchResultLibrary[] = [
  {
    bookTitle: "미움받을 용기",
    distanceMeters: 420,
    holdingStatus: "총 5권 · 대출 가능 4권",
    holidayInfo: "둘째·넷째 월요일",
    libraryId: "library-001",
    libraryName: "서울숲 열린도서관",
    loanStatus: "대출 가능",
    location: "서울 성동구 왕십리로 83-21",
    operatingHours: "09:00 - 22:00",
    operatingStatus: "운영중",
  },
  {
    bookTitle: "미움받을 용기",
    distanceMeters: 780,
    holdingStatus: "총 6권 · 대출 가능 1권",
    holidayInfo: "매주 화요일",
    libraryId: "library-002",
    libraryName: "성수 여행도서관",
    loanStatus: "대출 불가",
    location: "서울 성동구 연무장길 57",
    operatingHours: "10:00 - 20:00",
    operatingStatus: "운영중",
  },
  {
    bookTitle: "미움받을 용기",
    distanceMeters: 1200,
    holdingStatus: "총 6권 · 대출 가능 2권",
    holidayInfo: "연중무휴",
    libraryId: "library-003",
    libraryName: "왕십리 스마트도서관",
    loanStatus: "대출 불가",
    location: "서울 성동구 고산자로 270",
    operatingHours: "08:00 - 23:00",
    operatingStatus: "운영 종료",
  },
  {
    bookTitle: "미움받을 용기",
    distanceMeters: 1800,
    holdingStatus: "총 8권 · 대출 가능 5권",
    holidayInfo: "공휴일 휴관",
    libraryId: "library-004",
    libraryName: "한양 학술정보관",
    loanStatus: "대출 가능",
    location: "서울 성동구 왕십리로 222",
    operatingHours: "09:00 - 21:00",
    operatingStatus: "운영중",
  },
];

export function SearchResultLibraryList() {
  const bookTitle = SEARCH_RESULT_LIBRARIES[0]?.bookTitle ?? "대표 도서";

  return (
    <section className={styles.panel} aria-label="검색 결과 도서관 목록">
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <span className={styles.badge}>거리순 소장 도서관 리스트</span>
          <h2 className={styles.title}>&quot;{bookTitle}&quot; 보유 도서관</h2>
        </div>

        <p className={styles.description}>
          운영 여부, 대출 상태, 휴관 정보까지 함께 확인할 수 있습니다.
        </p>
      </div>

      <div className={styles.list}>
        {SEARCH_RESULT_LIBRARIES.map((library) => (
          <SearchResultLibraryCard
            key={library.libraryId}
            library={library}
          />
        ))}
      </div>
    </section>
  );
}
