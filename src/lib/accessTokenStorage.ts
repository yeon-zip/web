export const ACCESS_TOKEN_STORAGE_KEY = "polarstar_access_token_value";
export const ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY =
  "polarstar_access_token_expires_at";

type GetStoredAccessTokenOptions = {
  allowExpired?: boolean;
};

type SetStoredAccessTokenOptions = {
  expiresIn?: number;
};

function canUseLocalStorage() {
  return typeof window !== "undefined";
}

function getStoredExpiresAt() {
  if (!canUseLocalStorage()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(
    ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY,
  );

  if (!rawValue) {
    return null;
  }

  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function setStoredAccessToken(
  accessToken: string,
  options: SetStoredAccessTokenOptions = {},
) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);

  if (options.expiresIn) {
    const expiresAt = Date.now() + options.expiresIn * 1000;
    window.localStorage.setItem(
      ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY,
      String(expiresAt),
    );
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY);
}

export function getStoredAccessToken(
  options: GetStoredAccessTokenOptions = {},
) {
  if (!canUseLocalStorage()) {
    return null;
  }

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  if (!accessToken) {
    return null;
  }

  if (options.allowExpired) {
    return accessToken;
  }

  const expiresAt = getStoredExpiresAt();

  if (expiresAt && expiresAt <= Date.now()) {
    return null;
  }

  return accessToken;
}

export function clearStoredAccessToken() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY);
}
