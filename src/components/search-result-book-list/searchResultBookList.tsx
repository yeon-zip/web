"use client";

import { useEffect } from "react";
import { SEARCH_RESULT_BOOKS } from "@/data/searchResultBooks";
import { SearchResultBookCard } from "./searchResultBookCard";
import styles from "./searchResultBookList.module.css";

type SearchResultBookListProps = {
  onSelectBook: (bookId: string) => void;
  selectedBookId: string;
};

export function SearchResultBookList({
  onSelectBook,
  selectedBookId,
}: SearchResultBookListProps) {
  useEffect(() => {
    if (SEARCH_RESULT_BOOKS.length === 0) {
      return;
    }

    const hasSelectedBook = SEARCH_RESULT_BOOKS.some(
      (book) => book.bookId === selectedBookId,
    );

    if (!hasSelectedBook) {
      onSelectBook(SEARCH_RESULT_BOOKS[0].bookId);
    }
  }, [onSelectBook, selectedBookId]);

  return (
    <section className={styles.panel} aria-label="검색 결과 도서 목록">
      <div className={styles.header}>
        <span className={styles.badge}>검색 결과 도서</span>
        <p className={styles.description}>
          책 카드를 눌러 선택하면 이후 도서관 리스트가 선택한 책 기준으로 바뀌게
          됩니다.
        </p>
      </div>

      <div className={styles.rail}>
        {SEARCH_RESULT_BOOKS.map((book) => (
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
