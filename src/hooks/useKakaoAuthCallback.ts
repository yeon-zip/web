"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { exchangeAuthToken } from "@/api/exchangeAuthToken";
import {
  clearOAuthCodeVerifier,
  getOAuthCodeVerifier,
} from "@/lib/oauthCodeVerifierStorage";
import {
  getKakaoAuthCallbackParams,
  hasKakaoAuthCallbackParams,
} from "@/lib/kakaoAuthCallbackParams";
import { setStoredAuthTokens } from "@/lib/authStorage";

export function useKakaoAuthCallback() {
  const router = useRouter();
  const hasRequestedTokenRef = useRef(false);
  const [isHandlingAuthCallback, setIsHandlingAuthCallback] = useState(
    hasKakaoAuthCallbackParams,
  );

  useEffect(() => {
    const callbackParams = getKakaoAuthCallbackParams();

    if (!callbackParams || hasRequestedTokenRef.current) {
      return;
    }

    const codeVerifier = getOAuthCodeVerifier();

    if (!codeVerifier) {
      console.error("OAuth code verifier was not found.");
      clearOAuthCodeVerifier();
      queueMicrotask(() => setIsHandlingAuthCallback(false));
      router.replace("/");
      return;
    }

    hasRequestedTokenRef.current = true;

    exchangeAuthToken({
      ...callbackParams,
      codeVerifier,
    })
      .then((tokens) => {
        setStoredAuthTokens(tokens);
        clearOAuthCodeVerifier();
        router.replace("/home");
      })
      .catch((error) => {
        console.error("Failed to exchange Kakao auth code.", error);
        clearOAuthCodeVerifier();
        router.replace("/");
      })
      .finally(() => {
        setIsHandlingAuthCallback(false);
      });
  }, [router]);

  return isHandlingAuthCallback;
}
