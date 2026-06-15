"use client";

import { requestKakaoLogin } from "@/api/requestKakaoLogin";
import styles from "./kakaoLoginButton.module.css";

export function KakaoLoginButton() {
  const handleClick = async () => {
    await requestKakaoLogin();
  };

  return (
    <button type="button" className={styles.button} onClick={handleClick}>
      <span className={styles.icon} aria-hidden="true">
        K
      </span>
      <span className={styles.label}>카카오 로그인</span>
    </button>
  );
}
