import styles from "./summaryCard.module.css";

type SummaryCardProps = {
  label: string;
  description: string;
  onClick: () => void;
  value: string;
};

export function SummaryCard({
  label,
  value,
  description,
  onClick,
}: SummaryCardProps) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`${label} ${value}`}
    >
      <span className={styles.label}>{label}</span>
      <strong className={styles.value}>{value}</strong>
      <p className={styles.description}>{description}</p>
    </button>
  );
}
