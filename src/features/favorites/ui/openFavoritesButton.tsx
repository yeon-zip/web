import styles from "./openFavoritesButton.module.css";

type OpenFavoritesButtonProps = {
  onClick?: () => void;
};

export function OpenFavoritesButton({ onClick }: OpenFavoritesButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" role="img">
          <path
            d="M12 20.25 4.875 13.125a4.418 4.418 0 0 1 0-6.25 4.418 4.418 0 0 1 6.25 0L12 7.75l.875-.875a4.418 4.418 0 0 1 6.25 6.25L12 20.25Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>찜</span>
    </button>
  );
}
