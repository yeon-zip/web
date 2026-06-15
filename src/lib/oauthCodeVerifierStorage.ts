export const OAUTH_CODE_VERIFIER_STORAGE_KEY =
  "polarstar_oauth_code_verifier";

function canUseSessionStorage() {
  return typeof window !== "undefined";
}

export function setOAuthCodeVerifier(codeVerifier: string) {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(OAUTH_CODE_VERIFIER_STORAGE_KEY, codeVerifier);
}

export function getOAuthCodeVerifier() {
  if (!canUseSessionStorage()) {
    return null;
  }

  return window.sessionStorage.getItem(OAUTH_CODE_VERIFIER_STORAGE_KEY);
}

export function clearOAuthCodeVerifier() {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(OAUTH_CODE_VERIFIER_STORAGE_KEY);
}
