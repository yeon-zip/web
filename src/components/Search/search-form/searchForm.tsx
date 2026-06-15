"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredSearchRadius } from "@/lib/searchRadiusStorage";
import styles from "./searchForm.module.css";

export function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const trimmedQuery = query.trim();

  const handleSubmit = () => {
    if (!trimmedQuery) {
      setErrorMessage("도서 정보를 입력해주세요.");
      return;
    }

    setErrorMessage("");
    const nextSearchParams = new URLSearchParams({
      query: trimmedQuery,
    });
    const storedSearchRadius = getStoredSearchRadius();

    if (storedSearchRadius) {
      nextSearchParams.set("radiusKm", String(storedSearchRadius));
    }

    const nextUrl = `/search-list?${nextSearchParams.toString()}`;
    router.push(nextUrl);
  };

  return (
    <div className={styles.formBlock}>
      <form
        className={styles.form}
        role="search"
        aria-label="도서 검색"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
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
            aria-invalid={errorMessage ? "true" : "false"}
            onChange={(event) => {
              setQuery(event.target.value);

              if (event.target.value.trim()) {
                setErrorMessage("");
              }
            }}
          />
        </div>
        <button type="submit" className={styles.button}>
          검색하기
        </button>
      </form>

      {errorMessage ? (
        <p className={styles.errorMessage} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
