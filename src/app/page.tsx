import { AppHeader } from "@/widgets/app-header/ui/appHeader";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <AppHeader />

        <main className={styles.main}>
          <div className={styles.hero}>
            <span className={styles.eyebrow}>Home Preview</span>
            <h1>가까운 도서관에서 책 찾기</h1>
            <p>
              상단 헤더부터 먼저 구성했습니다. 다음 단계에서 검색 히어로, 위치
              액션, 요약 카드 블록을 이 구조 위에 붙이면 됩니다.
            </p>
          </div>

          <section className={styles.grid}>
            <article className={styles.card}>
              <span className={styles.cardLabel}>Widget</span>
              <strong>App Header</strong>
              <p>프로젝트 브랜드와 주요 액션 버튼을 조합한 상단 영역입니다.</p>
            </article>

            <article className={styles.card}>
              <span className={styles.cardLabel}>Feature</span>
              <strong>Open Favorites</strong>
              <p>사용자가 찜 목록으로 이동하는 액션을 분리한 버튼입니다.</p>
            </article>

            <article className={styles.card}>
              <span className={styles.cardLabel}>Feature</span>
              <strong>Sign In</strong>
              <p>
                로그인 진입 액션을 분리해 이후 인증 흐름과 연결하기 쉽게 둡니다.
              </p>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
