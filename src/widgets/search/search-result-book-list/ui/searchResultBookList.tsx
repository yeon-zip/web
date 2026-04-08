"use client";

import { useEffect } from "react";
import {
  SearchResultBookCard,
  type SearchResultBook,
} from "./searchResultBookCard";
import styles from "./searchResultBookList.module.css";

type SearchResultBookListProps = {
  onSelectBook: (bookId: string) => void;
  selectedBookId: string;
};

const SEARCH_RESULT_BOOKS: SearchResultBook[] = [
  {
    author: "기시미 이치로, 고가 후미타케",
    bookId: "book-001",
    coverColorFrom: "#2f6dff",
    coverColorTo: "#8fb5ff",
    genre: "자기계발",
    title: "미움받을 용기",
  },
  {
    author: "제임스 클리어",
    bookId: "book-002",
    coverColorFrom: "#0f8d77",
    coverColorTo: "#8ce6d4",
    genre: "자기계발",
    title: "아주 작은 습관의 힘",
  },
  {
    author: "세이노",
    bookId: "book-003",
    coverColorFrom: "#444ce7",
    coverColorTo: "#a2b2ff",
    genre: "에세이",
    title: "세이노의 가르침",
  },
  {
    author: "김호연",
    bookId: "book-004",
    coverColorFrom: "#f97316",
    coverColorTo: "#fdba74",
    genre: "소설",
    title: "불편한 편의점",
  },
  {
    author: "자청",
    bookId: "book-005",
    coverColorFrom: "#7c3aed",
    coverColorTo: "#c4b5fd",
    genre: "자기계발",
    title: "역행자",
  },
  {
    author: "김난도 외",
    bookId: "book-006",
    coverColorFrom: "#0f172a",
    coverColorTo: "#64748b",
    genre: "경제경영",
    title: "트렌드 코리아 2026",
  },
];

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
