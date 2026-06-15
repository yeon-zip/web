export const REFRESH_TOKEN_STORAGE_KEY = "polarstar_refresh_token";

function canUseLocalStorage() {
  return typeof window !== "undefined";
}

export function setRefreshToken(refreshToken: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

export function getRefreshToken() {
  if (!canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function clearRefreshToken() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}
