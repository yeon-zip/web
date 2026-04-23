import styles from "./summaryCard.module.css";

type SummaryCardProps = {
  label: string;
  value: string;
  description: string;
};

export function SummaryCard({
  label,
  value,
  description,
}: SummaryCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value}>{value}</strong>
      <p className={styles.description}>{description}</p>
    </article>
  );
}
