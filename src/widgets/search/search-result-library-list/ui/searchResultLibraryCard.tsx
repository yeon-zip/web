import { LibraryDetailButton } from "@/features/library-detail-button/ui/libraryDetailButton";
import { LibraryFavoriteButton } from "@/features/library-favorite-button/ui/libraryFavoriteButton";
import styles from "./searchResultLibraryCard.module.css";

export type SearchResultLibrary = {
  bookTitle: string;
  distanceMeters: number;
  holdingStatus: string;
  holidayInfo: string;
  libraryId: string;
  libraryName: string;
  loanStatus: "대출 가능" | "대출 불가";
  location: string;
  operatingHours: string;
  operatingStatus: "운영중" | "운영 종료";
};

type SearchResultLibraryCardProps = {
  library: SearchResultLibrary;
};

function formatDistance(distanceMeters: number) {
  if (distanceMeters < 1000) {
    return `${distanceMeters}m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)}km`;
}

export function SearchResultLibraryCard({
  library,
}: SearchResultLibraryCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{library.libraryName}</h3>
            <span className={styles.distanceChip}>
              {formatDistance(library.distanceMeters)}
            </span>
            <span
              className={`${styles.statusChip} ${
                library.operatingStatus === "운영중"
                  ? styles.operatingOpen
                  : styles.operatingClosed
              }`}
            >
              {library.operatingStatus}
            </span>
            <span
              className={`${styles.statusChip} ${
                library.loanStatus === "대출 가능"
                  ? styles.loanAvailable
                  : styles.loanUnavailable
              }`}
            >
              {library.loanStatus}
            </span>
          </div>

          <p className={styles.metaLine}>
            {library.location} · 운영시간 {library.operatingHours}
          </p>
        </div>

        <div className={styles.actions}>
          <LibraryDetailButton libraryId={library.libraryId} />
          <LibraryFavoriteButton libraryId={library.libraryId} />
        </div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>운영시간</span>
          <strong className={styles.infoValue}>{library.operatingHours}</strong>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>휴관 정보</span>
          <strong className={styles.infoValue}>{library.holidayInfo}</strong>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>검색 결과 보유 현황</span>
          <strong className={styles.infoValue}>{library.holdingStatus}</strong>
        </div>
      </div>
    </article>
  );
}
