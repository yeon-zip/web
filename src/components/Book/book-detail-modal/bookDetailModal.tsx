"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookDetail } from "@/api/getBookDetail";
import { BookFavoriteButton } from "@/components/Book/book-favorite-button/bookFavoriteButton";
import { BookVoteSection } from "@/components/Book/book-vote-section/bookVoteSection";
import { Modal } from "@/components/Modal/modal";
import type { BookDetail } from "@/type/search";
import styles from "./bookDetailModal.module.css";

type BookDetailModalProps = {
  isbn: string;
  onClose: () => void;
};

function formatPublicationDate(publicationDate: string) {
  if (!publicationDate) {
    return "출간일 정보 없음";
  }

  const parsedDate = new Date(publicationDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return publicationDate;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
}

function BookDetailContent({ book }: { book: BookDetail }) {
  return (
    <div className={styles.content}>
      <div className={styles.hero}>
        {book.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImageUrl}
            alt={`${book.title} 표지`}
            className={styles.coverImage}
          />
        ) : (
          <div className={styles.coverFallback}>
            <strong>{book.title}</strong>
          </div>
        )}

        <div className={styles.meta}>
          <span className={styles.isbn}>ISBN {book.isbn}</span>
          <h3 className={styles.title}>{book.title}</h3>
          <div className={styles.authorRow}>
            <p className={styles.author}>{book.author}</p>
            <BookFavoriteButton
              isbn={book.isbn}
              initialBookmarked={book.bookmarked}
            />
          </div>

          <dl className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <dt className={styles.detailLabel}>출판사</dt>
              <dd className={styles.detailValue}>{book.publisher}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt className={styles.detailLabel}>출간일</dt>
              <dd className={styles.detailValue}>
                {formatPublicationDate(book.publicationDate)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section className={styles.section}>
        <BookVoteSection
          isbn={book.isbn}
          initialVoteSummary={book.voteSummary}
        />
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>도서 소개</h4>
        <p className={styles.description}>
          {book.description || "도서 소개 정보가 아직 준비되지 않았어요."}
        </p>
      </section>
    </div>
  );
}

export function BookDetailModal({ isbn, onClose }: BookDetailModalProps) {
  const bookDetailQuery = useQuery({
    queryKey: ["books", "detail", isbn],
    queryFn: () => getBookDetail({ isbn }),
    staleTime: 60_000,
  });

  return (
    <Modal
      title="도서 상세 정보"
      description="선택한 도서의 상세 정보를 확인할 수 있어요."
      onClose={onClose}
    >
      {bookDetailQuery.isLoading ? (
        <p className={styles.feedback}>도서 상세 정보를 불러오는 중입니다...</p>
      ) : null}

      {bookDetailQuery.isError ? (
        <p className={styles.error}>
          도서 상세 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </p>
      ) : null}

      {bookDetailQuery.data ? (
        <BookDetailContent book={bookDetailQuery.data} />
      ) : null}
    </Modal>
  );
}
