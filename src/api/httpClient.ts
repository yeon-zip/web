import { buildPolarisApiUrl } from "@/api/apiConfig";
import { getStoredAccessToken } from "@/lib/accessTokenStorage";
import { setStoredAuthState, setStoredAuthTokens } from "@/lib/authStorage";
import { getRefreshToken } from "@/lib/refreshTokenStorage";
import type { AuthTokenResponse } from "@/type/auth";
import type {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequestConfig,
} from "@/type/Interface/httpClientInterface";

type ErrorResponseBody = {
  detail?: string;
  errorCode?: string;
  title?: string;
};

class HttpRequestError extends Error {
  status: number;
  responseBody?: ErrorResponseBody | string;

  constructor(status: number, responseBody?: ErrorResponseBody | string) {
    const message =
      typeof responseBody === "string"
        ? responseBody
        : responseBody?.detail ?? `HTTP 요청 실패: ${status}`;

    super(message);
    this.name = "HttpRequestError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

let refreshAuthPromise: Promise<string | null> | null = null;

// 쿼리 파라미터 생성 함수
function buildUrl(url: string, params?: HttpParams) {
  if (!params) {
    return url;
  }

  // 쿼리 문자열 생성
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();

  if (!queryString) {
    return url;
  }

  return `${url}?${queryString}`;
}

// 응답 처리
async function parseResponseBody(response: Response) {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return await response.json();
  }

  return await response.text();
}

async function parseResponse<TResponse>(response: Response) {
  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    throw new HttpRequestError(
      response.status,
      typeof responseBody === "string" || responseBody === undefined
        ? responseBody
        : (responseBody as ErrorResponseBody),
    );
  }

  return responseBody as TResponse;
}

// fetch 옵션 생성
function createRequestInit<TBody>(
  config: HttpRequestConfig<TBody>,
): RequestInit {
  // 기존 헤더 복사
  const headers: HttpHeaders = {
    ...(config.headers ?? {}),
  };

  let body: BodyInit | undefined;

  if (config.data !== undefined) {
    if (config.data instanceof FormData) {
      body = config.data;
    } else {
      headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
      body = JSON.stringify(config.data);
    }
  }

  return {
    method: config.method ?? "GET",
    headers,
    body,
  };
}

function hasAuthorizationHeader(headers?: HttpHeaders) {
  return Boolean(headers?.Authorization);
}

function hasRefreshTokenHeader(headers?: HttpHeaders) {
  return Boolean(headers?.["Refresh-Token"]);
}

function validateAuthTokenResponse(
  response: AuthTokenResponse,
): AuthTokenResponse {
  if (!response.accessToken || !response.refreshToken) {
    throw new Error("Auth token response is missing required tokens.");
  }

  return response;
}

async function requestAuthTokenRefresh() {
  const accessToken = getStoredAccessToken({ allowExpired: true });
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    setStoredAuthState(false);
    return null;
  }

  const response = await fetch(buildPolarisApiUrl("/api/v1/auth/refresh"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Refresh-Token": refreshToken,
    },
  });
  const nextTokens = validateAuthTokenResponse(
    await parseResponse<AuthTokenResponse>(response),
  );

  setStoredAuthTokens(nextTokens);

  return nextTokens.accessToken;
}

async function refreshAuthToken() {
  if (!refreshAuthPromise) {
    refreshAuthPromise = requestAuthTokenRefresh()
      .catch((error) => {
        setStoredAuthState(false);
        throw error;
      })
      .finally(() => {
        refreshAuthPromise = null;
      });
  }

  return refreshAuthPromise;
}

async function sendRequest<TResponse, TBody = unknown>(
  config: HttpRequestConfig<TBody>,
) {
  const response = await fetch(
    buildUrl(config.url, config.params),
    createRequestInit(config),
  );

  return parseResponse<TResponse>(response);
}

function createRetryHeaders(
  headers: HttpHeaders | undefined,
  accessToken: string,
) {
  const nextHeaders: HttpHeaders = {
    ...(headers ?? {}),
    Authorization: `Bearer ${accessToken}`,
  };

  if (hasRefreshTokenHeader(headers)) {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      nextHeaders["Refresh-Token"] = refreshToken;
    }
  }

  return nextHeaders;
}

export const fetchHttpClient: HttpClient = {
  async request<TResponse, TBody = unknown>(config: HttpRequestConfig<TBody>) {
    try {
      return await sendRequest<TResponse, TBody>(config);
    } catch (error) {
      if (
        config.skipAuthRefresh ||
        !(error instanceof HttpRequestError) ||
        error.status !== 401 ||
        !hasAuthorizationHeader(config.headers)
      ) {
        throw error;
      }

      const nextAccessToken = await refreshAuthToken();

      if (!nextAccessToken) {
        throw error;
      }

      return sendRequest<TResponse, TBody>({
        ...config,
        headers: createRetryHeaders(config.headers, nextAccessToken),
        skipAuthRefresh: true,
      });
    }
  },

  get(url, config) {
    return this.request({
      ...config,
      url,
      method: "GET",
    });
  },

  post(url, data, config) {
    return this.request({
      ...config,
      url,
      data,
      method: "POST",
    });
  },

  put(url, data, config) {
    return this.request({
      ...config,
      url,
      data,
      method: "PUT",
    });
  },

  patch(url, data, config) {
    return this.request({
      ...config,
      url,
      data,
      method: "PATCH",
    });
  },

  delete(url, config) {
    return this.request({
      ...config,
      url,
      method: "DELETE",
    });
  },
};

export const httpClient = fetchHttpClient;
