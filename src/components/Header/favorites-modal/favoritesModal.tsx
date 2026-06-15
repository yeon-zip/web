"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookmarkedBooks } from "@/api/getBookmarkedBooks";
import { getBookmarkedLibraries } from "@/api/getBookmarkedLibraries";
import { unbookmarkBook } from "@/api/unbookmarkBook";
import { unbookmarkLibrary } from "@/api/unbookmarkLibrary";
import { Modal } from "@/components/Modal/modal";
import type {
  BookmarkedBookItem,
  BookmarkedLibraryItem,
} from "@/type/bookmark";
import styles from "./favoritesModal.module.css";

type FavoritesModalProps = {
  onClose: () => void;
};

type FavoriteTab = "libraries" | "books";

function FavoriteLibraryList({
  libraries,
}: {
  libraries: BookmarkedLibraryItem[];
}) {
  const queryClient = useQueryClient();
  const removeLibraryMutation = useMutation({
    mutationFn: (libraryId: string) => unbookmarkLibrary(libraryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "libraries"] });
      queryClient.invalidateQueries({ queryKey: ["libraries"] });
    },
  });

  if (libraries.length === 0) {
    return <p className={styles.feedback}>찜한 도서관이 아직 없어요.</p>;
  }

  return (
    <div className={styles.list}>
      {libraries.map((library) => (
        <article key={library.libraryId} className={styles.item}>
          <div className={styles.itemText}>
            <h3 className={styles.itemTitle}>{library.name}</h3>
            <p className={styles.itemMeta}>{library.address}</p>
          </div>
          <button
            type="button"
            className={styles.removeButton}
            disabled={
              removeLibraryMutation.isPending &&
              removeLibraryMutation.variables === String(library.libraryId)
            }
            onClick={() =>
              removeLibraryMutation.mutate(String(library.libraryId))
            }
          >
            찜 해제
          </button>
        </article>
      ))}
    </div>
  );
}

function FavoriteBookList({ books }: { books: BookmarkedBookItem[] }) {
  const queryClient = useQueryClient();
  const removeBookMutation = useMutation({
    mutationFn: (isbn: string) => unbookmarkBook(isbn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "books"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  if (books.length === 0) {
    return <p className={styles.feedback}>찜한 도서가 아직 없어요.</p>;
  }

  return (
    <div className={styles.list}>
      {books.map((book) => (
        <article key={book.isbn} className={styles.item}>
          {book.coverImageUrl ? (
            <div
              className={styles.bookCover}
              style={{ backgroundImage: `url("${book.coverImageUrl}")` }}
              aria-hidden="true"
            />
          ) : (
            <div className={styles.emptyCover} aria-hidden="true" />
          )}
          <div className={styles.itemText}>
            <h3 className={styles.itemTitle}>{book.title}</h3>
            <p className={styles.itemMeta}>{book.author}</p>
            <p className={styles.itemSubMeta}>ISBN {book.isbn}</p>
          </div>
          <button
            type="button"
            className={styles.removeButton}
            disabled={
              removeBookMutation.isPending &&
              removeBookMutation.variables === book.isbn
            }
            onClick={() => removeBookMutation.mutate(book.isbn)}
          >
            찜 해제
          </button>
        </article>
      ))}
    </div>
  );
}

export function FavoritesModal({ onClose }: FavoritesModalProps) {
  const [activeTab, setActiveTab] = useState<FavoriteTab>("books");
  const librariesQuery = useQuery({
    queryKey: ["bookmarks", "libraries"],
    queryFn: getBookmarkedLibraries,
  });
  const booksQuery = useQuery({
    queryKey: ["bookmarks", "books"],
    queryFn: getBookmarkedBooks,
  });
  const activeQuery = activeTab === "libraries" ? librariesQuery : booksQuery;

  return (
    <Modal
      title="찜 목록"
      description="저장해 둔 도서와 도서관을 한 곳에서 확인할 수 있어요."
      onClose={onClose}
    >
      <div className={styles.tabs} role="tablist" aria-label="찜 목록 종류">
        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "books" ? styles.activeTab : ""
          }`}
          role="tab"
          aria-selected={activeTab === "books"}
          onClick={() => setActiveTab("books")}
        >
          도서
        </button>
        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "libraries" ? styles.activeTab : ""
          }`}
          role="tab"
          aria-selected={activeTab === "libraries"}
          onClick={() => setActiveTab("libraries")}
        >
          도서관
        </button>
      </div>

      {activeQuery.isLoading ? (
        <p className={styles.feedback}>찜 목록을 불러오는 중입니다...</p>
      ) : null}

      {activeQuery.isError ? (
        <p className={styles.error}>
          찜 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </p>
      ) : null}

      {activeTab === "libraries" && librariesQuery.data ? (
        <FavoriteLibraryList libraries={librariesQuery.data.items} />
      ) : null}

      {activeTab === "books" && booksQuery.data ? (
        <FavoriteBookList books={booksQuery.data.items} />
      ) : null}
    </Modal>
  );
}
