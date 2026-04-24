import styles from "./libraryDetailButton.module.css";

type LibraryDetailButtonProps = {
  libraryId: string;
  onClick?: (libraryId: string) => void;
};

export function LibraryDetailButton({
  libraryId,
  onClick,
}: LibraryDetailButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      data-library-id={libraryId}
      onClick={() => onClick?.(libraryId)}
    >
      도서관 상세
    </button>
  );
}
