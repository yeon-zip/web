"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppHeader } from "@/components/Header/app-header/appHeader";
import {
  AUTH_STATE_CHANGE_EVENT,
  getStoredAuthState,
} from "@/lib/authStorage";
import { useKakaoAuthCallback } from "@/hooks/useKakaoAuthCallback";
import styles from "./authAppShell.module.css";

const LOGIN_PATHS = new Set(["/", "/login"]);

type AuthAppShellProps = {
  children: React.ReactNode;
};

function subscribeAuthState(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_STATE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_STATE_CHANGE_EVENT, onStoreChange);
  };
}

export function AuthAppShell({ children }: AuthAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHandlingAuthCallback = useKakaoAuthCallback();
  const isAuthenticated = useSyncExternalStore(
    subscribeAuthState,
    getStoredAuthState,
    () => false,
  );
  const isLoginPath = LOGIN_PATHS.has(pathname);

  useEffect(() => {
    if (isHandlingAuthCallback) {
      return;
    }

    if (isAuthenticated && isLoginPath) {
      router.replace("/home");
      return;
    }

    if (!isAuthenticated && !isLoginPath) {
      router.replace("/");
    }
  }, [isAuthenticated, isHandlingAuthCallback, isLoginPath, router]);

  if (
    isHandlingAuthCallback ||
    (!isAuthenticated && !isLoginPath) ||
    (isAuthenticated && isLoginPath)
  ) {
    return <main className={styles.content} />;
  }

  return (
    <>
      {isAuthenticated && !isLoginPath ? <AppHeader /> : null}
      <main className={styles.content}>{children}</main>
    </>
  );
}
