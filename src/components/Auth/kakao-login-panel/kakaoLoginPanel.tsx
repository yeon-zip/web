import { KakaoLoginButton } from "@/components/Auth/kakao-login-button/kakaoLoginButton";
import styles from "./kakaoLoginPanel.module.css";

const loginBenefits = [
  "관심 도서관과 도서를 한곳에 모아둘 수 있어요.",
  "검색한 책의 소장 여부를 더 빠르게 다시 확인할 수 있어요.",
  "내 주변 도서관 탐색 경험을 이어서 사용할 수 있어요.",
];

export function KakaoLoginPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.headingGroup}>
        <h1 className={styles.title}>카카오로 간편 시작하기</h1>
        <p className={styles.description}>
          가장 가까운 도서관들을 빠르고 간편하게 확인해보세요.
        </p>
      </div>

      <KakaoLoginButton />

      <ul className={styles.benefitList}>
        {loginBenefits.map((benefit) => (
          <li key={benefit} className={styles.benefitItem}>
            <span className={styles.checkMark} aria-hidden="true">
              ✓
            </span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
