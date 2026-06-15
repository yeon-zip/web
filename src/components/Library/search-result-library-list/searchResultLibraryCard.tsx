"use client";

import { useState } from "react";
import { LibraryDetailButton } from "@/components/Library/Button/library-detail-button/libraryDetailButton";
import { LibraryFavoriteButton } from "@/components/Library/Button/library-favorite-button/libraryFavoriteButton";
import { LibraryNotificationButton } from "@/components/Library/Button/library-notification-button/libraryNotificationButton";
import { LibraryDetailModal } from "@/components/Library/library-detail-modal/libraryDetailModal";
import type { SearchResultLibrary } from "@/type/search";
import styles from "./searchResultLibraryCard.module.css";

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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  return (
    <>
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

            <p className={styles.metaLine}>{library.location}</p>
          </div>

          <div className={styles.actions}>
            <LibraryDetailButton
              libraryId={library.libraryId}
              onClick={() => setIsDetailModalOpen(true)}
            />
            <div className={styles.iconActions}>
              <LibraryFavoriteButton
                libraryId={library.libraryId}
                initialBookmarked={library.bookmarked}
              />
              {library.loanStatus === "대출 불가" && library.isbn ? (
                <LibraryNotificationButton
                  isbn={library.isbn}
                  libraryId={library.libraryId}
                />
              ) : null}
            </div>
          </div>
        </div>
      </article>

      {isDetailModalOpen ? (
        <LibraryDetailModal
          libraryId={library.libraryId}
          onClose={() => setIsDetailModalOpen(false)}
        />
      ) : null}
    </>
  );
}
