"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./searchForm.module.css";

export function SearchForm() {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  const searchHref = trimmedQuery
    ? `/search-list?query=${encodeURIComponent(trimmedQuery)}`
    : "/search-list";

  return (
    <div className={styles.form} role="search" aria-label="도서 검색">
      <div className={styles.inputShell}>
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M11 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 0c-2.761 0-5 2.239-5 5m10 0c0 2.761-2.239 5-5 5m0-10c2.761 0 5 2.239 5 5m-5 5a5 5 0 0 1 0-10m6.5 11.5L16 16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <input
          type="text"
          className={styles.input}
          value={query}
          placeholder="예: 미움받을 용기, 이호철, 97889972752870"
          aria-label="검색어 입력"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <Link className={styles.button} href={searchHref}>
        검색하기
      </Link>
    </div>
  );
}
