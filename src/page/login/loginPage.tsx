import { KakaoLoginPanel } from "@/components/Auth/kakao-login-panel/kakaoLoginPanel";
import styles from "./loginPage.module.css";

export function LoginPage() {
  return (
    <section className={styles.page}>
      <KakaoLoginPanel />
    </section>
  );
}
