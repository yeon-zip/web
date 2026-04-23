import styles from "./libraryFavoriteButton.module.css";

type LibraryFavoriteButtonProps = {
  libraryId: string;
  onClick?: (libraryId: string) => void;
};

export function LibraryFavoriteButton({
  libraryId,
  onClick,
}: LibraryFavoriteButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      data-library-id={libraryId}
      onClick={() => onClick?.(libraryId)}
    >
      도서관 찜
    </button>
  );
}
