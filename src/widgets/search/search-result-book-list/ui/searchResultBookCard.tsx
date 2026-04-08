import type { KeyboardEvent } from "react";
import styles from "./searchResultBookCard.module.css";

export type SearchResultBook = {
  author: string;
  bookId: string;
  coverColorFrom: string;
  coverColorTo: string;
  genre: string;
  title: string;
};

type SearchResultBookCardProps = {
  book: SearchResultBook;
  onSelect: (bookId: string) => void;
  selected: boolean;
};

export function SearchResultBookCard({
  book,
  onSelect,
  selected,
}: SearchResultBookCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(book.bookId);
    }
  };

  return (
    <article
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect(book.bookId)}
      onKeyDown={handleKeyDown}
    >
      <div
        className={styles.cover}
        style={{
          background: `linear-gradient(150deg, ${book.coverColorFrom} 0%, ${book.coverColorTo} 100%)`,
        }}
      >
        <div className={styles.coverMeta}>
          <span className={styles.genre}>{book.genre}</span>
          <strong className={styles.coverTitle}>{book.title}</strong>
          <span className={styles.coverAuthor}>{book.author}</span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.textBlock}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>
        </div>

        <div className={styles.actions}>
          {selected ? <span className={styles.selectedLabel}>선택됨</span> : null}
          <button
            type="button"
            className={styles.detailButton}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            상세보기
          </button>
        </div>
      </div>
    </article>
  );
}
