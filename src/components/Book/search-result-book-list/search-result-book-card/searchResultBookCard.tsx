import type { KeyboardEvent } from "react";
import type { SearchResultBook } from "@/type/search";
import styles from "./searchResultBookCard.module.css";

type SearchResultBookCardProps = {
  book: SearchResultBook;
  onOpenDetail: (isbn: string) => void;
  onSelect: (bookId: string) => void;
  selected: boolean;
};

export function SearchResultBookCard({
  book,
  onOpenDetail,
  onSelect,
  selected,
}: SearchResultBookCardProps) {
  const coverStyle = book.coverImageUrl
    ? {
        backgroundImage: `url("${book.coverImageUrl}")`,
      }
    : {
        background: `linear-gradient(150deg, ${book.coverColorFrom} 0%, ${book.coverColorTo} 100%)`,
      };

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
      <div className={styles.cover} style={coverStyle}>
        <button
          type="button"
          className={styles.detailButton}
          onClick={(event) => {
            event.stopPropagation();
            if (book.isbn) {
              onOpenDetail(book.isbn);
            }
          }}
          disabled={!book.isbn}
        >
          상세보기
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.textBlock}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>
        </div>
      </div>
    </article>
  );
}
