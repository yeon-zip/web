export const ACCESS_TOKEN_COOKIE_NAME = "polarstar_access_token";

type SetAccessTokenCookieOptions = {
  expiresIn?: number;
};

function canUseDocumentCookie() {
  return typeof document !== "undefined";
}

function getCookieSecureAttribute() {
  if (typeof window === "undefined" || window.location.protocol !== "https:") {
    return "";
  }

  return "; Secure";
}

export function setAccessTokenCookie(
  accessToken: string,
  options: SetAccessTokenCookieOptions = {},
) {
  if (!canUseDocumentCookie()) {
    return;
  }

  const maxAge = options.expiresIn ? `; Max-Age=${options.expiresIn}` : "";
  document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=${encodeURIComponent(
    accessToken,
  )}; Path=/; SameSite=Lax${maxAge}${getCookieSecureAttribute()}`;
}

export function getAccessTokenCookie() {
  if (!canUseDocumentCookie()) {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${ACCESS_TOKEN_COOKIE_NAME}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

export function clearAccessTokenCookie() {
  if (!canUseDocumentCookie()) {
    return;
  }

  document.cookie = `${ACCESS_TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${getCookieSecureAttribute()}`;
}
