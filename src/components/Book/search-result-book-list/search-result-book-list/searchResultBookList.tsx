"use client";

import { useEffect, useState } from "react";
import { BookDetailModal } from "@/components/Book/book-detail-modal/bookDetailModal";
import type { SearchResultBook } from "@/type/search";
import { SearchResultBookCard } from "../search-result-book-card/searchResultBookCard";
import styles from "./searchResultBookList.module.css";

type SearchResultBookListProps = {
  books: SearchResultBook[];
  isLoading: boolean;
  isError: boolean;
  onSelectBook: (bookId: string) => void;
  selectedBookId: string;
};

export function SearchResultBookList({
  books,
  isLoading,
  isError,
  onSelectBook,
  selectedBookId,
}: SearchResultBookListProps) {
  const [detailBookIsbn, setDetailBookIsbn] = useState<string | null>(null);

  useEffect(() => {
    if (books.length === 0) {
      return;
    }

    const hasSelectedBook = books.some(
      (book) => book.bookId === selectedBookId,
    );

    if (!hasSelectedBook) {
      onSelectBook(books[0].bookId);
    }
  }, [books, onSelectBook, selectedBookId]);

  if (isLoading) {
    return (
      <section className={styles.panel} aria-label="검색 결과 도서 목록">
        <div className={styles.header}>
          <span className={styles.badge}>검색 결과 도서</span>
          <p className={styles.description}>도서 목록을 불러오는 중입니다.</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.panel} aria-label="검색 결과 도서 목록">
        <div className={styles.header}>
          <span className={styles.badge}>검색 결과 도서</span>
          <p className={styles.description}>도서 목록을 불러오지 못했어요.</p>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className={styles.panel} aria-label="검색 결과 도서 목록">
        <div className={styles.header}>
          <span className={styles.badge}>검색 결과 도서</span>
          <p className={styles.description}>
            검색어와 연관된 도서를 찾지 못했어요.
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
          책 카드를 눌러 선택하면 이후 도서관 리스트가 선택한 책 기준으로 바뀌게
          됩니다.
        </p>
      </div>

      <div className={styles.rail}>
        {books.map((book) => (
          <SearchResultBookCard
            key={book.bookId}
            book={book}
            onOpenDetail={setDetailBookIsbn}
            selected={selectedBookId === book.bookId}
            onSelect={onSelectBook}
          />
        ))}
      </div>

      {detailBookIsbn ? (
        <BookDetailModal
          isbn={detailBookIsbn}
          onClose={() => setDetailBookIsbn(null)}
        />
      ) : null}
    </section>
  );
}
