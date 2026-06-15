"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarkBook } from "@/api/bookmarkBook";
import { unbookmarkBook } from "@/api/unbookmarkBook";
import type { BookDetail, SearchResultBook } from "@/type/search";
import styles from "./bookFavoriteButton.module.css";

type BookFavoriteButtonProps = {
  isbn: string;
  initialBookmarked?: boolean;
};

export function BookFavoriteButton({
  isbn,
  initialBookmarked = false,
}: BookFavoriteButtonProps) {
  const queryClient = useQueryClient();
  const [bookmarkedOverride, setBookmarkedOverride] = useState<{
    isbn: string;
    value: boolean;
  } | null>(null);
  const isBookmarked =
    bookmarkedOverride?.isbn === isbn
      ? bookmarkedOverride.value
      : initialBookmarked;

  const bookmarkMutation = useMutation({
    mutationFn: (nextBookmarked: boolean) =>
      nextBookmarked ? bookmarkBook(isbn) : unbookmarkBook(isbn),
    onSuccess: (_, nextBookmarked) => {
      setBookmarkedOverride({
        isbn,
        value: nextBookmarked,
      });
      queryClient.setQueryData<BookDetail>(
        ["books", "detail", isbn],
        (previousBook) =>
          previousBook
            ? {
                ...previousBook,
                bookmarked: nextBookmarked,
              }
            : previousBook,
      );
      queryClient.setQueriesData<SearchResultBook[]>(
        { queryKey: ["books", "search"] },
        (previousBooks) =>
          previousBooks?.map((book) =>
            book.isbn === isbn || book.bookId === isbn
              ? {
                  ...book,
                  bookmarked: nextBookmarked,
                }
              : book,
          ),
      );
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "books"] });
    },
  });
  const isPending = bookmarkMutation.isPending;
  const label = isPending
    ? "처리 중..."
    : isBookmarked
      ? "도서 찜 해제"
      : bookmarkMutation.isError
        ? "다시 시도"
        : "도서 찜";

  return (
    <button
      type="button"
      className={`${styles.button} ${isBookmarked ? styles.bookmarked : ""}`}
      onClick={(event) => {
        event.stopPropagation();
        bookmarkMutation.mutate(!isBookmarked);
      }}
      disabled={isPending}
      aria-pressed={isBookmarked}
      aria-label={label}
      title={label}
    >
      <span className={styles.heart} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" role="img">
          <path
            className={styles.heartPath}
            d="M12 20.25 4.875 13.125a4.418 4.418 0 0 1 0-6.25 4.418 4.418 0 0 1 6.25 0L12 7.75l.875-.875a4.418 4.418 0 0 1 6.25 6.25L12 20.25Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
