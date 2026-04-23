"use client";

import { SEARCH_RESULT_LIBRARIES } from "@/data/searchResultLibraries";
import { SearchResultLibraryCard } from "./searchResultLibraryCard";
import styles from "./searchResultLibraryList.module.css";

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
