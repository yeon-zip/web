import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>Project Foundation</span>
          <h1>PolarStar Web</h1>
          <p>
            Next.js, React, TypeScript, CSS Modules, FSD 구조를 기준으로 초기 셋업을
            완료한 상태입니다. 이후 화면 구현은 기능 브랜치 단위로 진행합니다.
          </p>
        </div>

        <section className={styles.grid}>
          <article className={styles.card}>
            <span className={styles.cardLabel}>Stack</span>
            <strong>Next.js + React Query</strong>
            <p>TypeScript, React 19, CSS Modules 기반</p>
          </article>

          <article className={styles.card}>
            <span className={styles.cardLabel}>Architecture</span>
            <strong>FSD Ready</strong>
            <p>src/features, src/entities, src/widgets, src/shared 구조 준비</p>
          </article>

          <article className={styles.card}>
            <span className={styles.cardLabel}>Workflow</span>
            <strong>Feature Branch + PR</strong>
            <p>기능 단위 브랜치에서 작업 후 커밋, 푸시, PR 병합</p>
          </article>
        </section>
      </main>
    </div>
  );
}
