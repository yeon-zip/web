import styles from "./locationSelectorButton.module.css";

type LocationSelectorButtonProps = {
  label: string;
  onClick?: () => void;
  selected?: boolean;
};

export function LocationSelectorButton({
  label,
  onClick,
  selected = false,
}: LocationSelectorButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${selected ? styles.selected : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
