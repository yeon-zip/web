import {
  clearAccessTokenCookie,
  setAccessTokenCookie,
} from "@/lib/authCookie";
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  setStoredAccessToken,
} from "@/lib/accessTokenStorage";
import {
  clearRefreshToken,
  getRefreshToken,
  setRefreshToken,
} from "@/lib/refreshTokenStorage";
import type { AuthTokenResponse } from "@/type/auth";

export const AUTH_STORAGE_KEY = "polarstar_mock_authenticated";
export const AUTH_STATE_CHANGE_EVENT = "polarstar-auth-state-change";

export function getStoredAuthState() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(getStoredAccessToken()) || Boolean(getRefreshToken());
}

export function setStoredAuthState(isAuthenticated: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  if (isAuthenticated) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    clearAccessTokenCookie();
    clearStoredAccessToken();
    clearRefreshToken();
  }

  window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT));
}

export function setStoredAuthTokens(tokens: AuthTokenResponse) {
  if (typeof window === "undefined") {
    return;
  }

  setAccessTokenCookie(tokens.accessToken, { expiresIn: tokens.expiresIn });
  setStoredAccessToken(tokens.accessToken, { expiresIn: tokens.expiresIn });
  setRefreshToken(tokens.refreshToken);
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT));
}
