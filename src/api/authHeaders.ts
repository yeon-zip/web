import { getStoredAccessToken } from "@/lib/accessTokenStorage";
import { getRefreshToken } from "@/lib/refreshTokenStorage";
import type { HttpHeaders } from "@/type/Interface/httpClientInterface";

export function createAuthHeaders(): HttpHeaders {
  const accessToken = getStoredAccessToken({ allowExpired: true });

  if (!accessToken) {
    throw new Error("로그인이 필요한 요청입니다.");
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export function createOptionalAuthHeaders(): HttpHeaders | undefined {
  const accessToken = getStoredAccessToken({ allowExpired: true });

  if (!accessToken) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export function createSessionAuthHeaders(): HttpHeaders {
  const accessToken = getStoredAccessToken({ allowExpired: true });
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    throw new Error("로그인이 필요한 요청입니다.");
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    "Refresh-Token": refreshToken,
  };
}
