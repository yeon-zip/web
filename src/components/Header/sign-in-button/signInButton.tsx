"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/api/logout";
import { requestKakaoLogin } from "@/api/requestKakaoLogin";
import {
  AUTH_STATE_CHANGE_EVENT,
  getStoredAuthState,
  setStoredAuthState,
} from "@/lib/authStorage";
import styles from "./signInButton.module.css";

function subscribeAuthState(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_STATE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_STATE_CHANGE_EVENT, onStoreChange);
  };
}

export function SignInButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const isAuthenticated = useSyncExternalStore(
    subscribeAuthState,
    getStoredAuthState,
    () => false,
  );

  const handleClick = async () => {
    if (!isAuthenticated) {
      await requestKakaoLogin();
      return;
    }

    setIsPending(true);

    try {
      await logout();
      setStoredAuthState(false);
      router.replace("/login");
    } catch (error) {
      console.error("Failed to logout.", error);
      setStoredAuthState(false);
      router.replace("/login");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      disabled={isPending}
    >
      {isAuthenticated ? "로그아웃" : "로그인"}
    </button>
  );
}
