"use client";

import { ClipLoader } from "react-spinners";
import type { SearchResultBook } from "../api/searchResultBooksApi";
import { SearchResultBookCard } from "./searchResultBookCard";
import styles from "./searchResultBookList.module.css";

type SearchResultBookListProps = {
  books: SearchResultBook[];
  isError: boolean;
  isLoading: boolean;
  onSelectBook: (bookId: string) => void;
  selectedBookId: string;
};

export function SearchResultBookList({
  books,
  isError,
  isLoading,
  onSelectBook,
  selectedBookId,
}: SearchResultBookListProps) {
  if (isLoading) {
    return (
      <section className={styles.panel}>
        <div className={styles.feedback} role="status" aria-label="검색 결과 도서 불러오는 중">
          <ClipLoader color="#3151e5" size={34} />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.panel}>
        <div className={styles.feedback}>
          <p className={styles.errorText}>검색 결과 도서를 불러오지 못했어요.</p>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className={styles.panel}>
        <div className={styles.feedback}>
          <p className={styles.emptyTitle}>검색 결과가 없어요.</p>
          <p className={styles.emptyDescription}>
            다른 검색어로 다시 검색해보세요.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-label="검색 결과 도서 목록">
      <div className={styles.header}>
        <span className={styles.badge}>검색 결과 도서</span>
        <p className={styles.description}>
          책 카드를 눌러 선택하면 이후 도서관 리스트가 선택한 책 기준으로
          바뀌게 됩니다.
        </p>
      </div>

      <div className={styles.rail}>
        {books.map((book) => (
          <SearchResultBookCard
            key={book.bookId}
            book={book}
            selected={selectedBookId === book.bookId}
            onSelect={onSelectBook}
          />
        ))}
      </div>
    </section>
  );
}
