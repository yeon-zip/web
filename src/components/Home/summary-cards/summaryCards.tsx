"use client";

import { ClipLoader } from "react-spinners";
import { SummaryCard } from "./summaryCard";
import { useLibrarySummaryCards } from "./useLibrarySummaryCards";
import styles from "./summaryCards.module.css";

export function SummaryCards() {
  const { nearbyLibraryCount, openLibraryCount, isError, isLoading } =
    useLibrarySummaryCards();

  if (isLoading) {
    return (
      <div className={styles.loading} role="status" aria-label="요약 정보 불러오는 중">
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

  return (
    <div className={styles.grid}>
      <SummaryCard
        label="검색반경"
        value="10km"
        description="성수동 기준으로 가까운 도서관을 탐색해요"
      />
      <SummaryCard
        label="주변도서관"
        value={`${nearbyLibraryCount}곳`}
        description="현재 위치에서 바로 확인 가능한 도서관 수예요"
      />
      <SummaryCard
        label="운영중"
        value={`${openLibraryCount}곳`}
        description="지금 바로 방문 가능한 도서관만 따로 모았어요"
      />
    </div>
  );
}
