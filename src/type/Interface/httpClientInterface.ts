export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// 쿼리 파라미터 값 타입
export type HttpPrimitive = string | number | boolean;

// 쿼리 파라미터 객체 타입
export type HttpParams = Record<string, HttpPrimitive | null | undefined>;

export type HttpHeaders = Record<string, string>;

export type HttpRequestConfig<TBody = unknown> = {
  url: string;
  method?: HttpMethod;
  params?: HttpParams;
  data?: TBody;
  headers?: HttpHeaders;
  skipAuthRefresh?: boolean;
};

export interface HttpClient {
  request<TResponse, TBody = unknown>(
    config: HttpRequestConfig<TBody>,
  ): Promise<TResponse>;

  get<TResponse>(
    url: string,
    config?: Omit<HttpRequestConfig, "url" | "method" | "data">, // HttpRequestConfig에서 url, method, data를 뺀 타입
  ): Promise<TResponse>;

  post<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: Omit<HttpRequestConfig<TBody>, "url" | "method" | "data">,
  ): Promise<TResponse>;

  put<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: Omit<HttpRequestConfig<TBody>, "url" | "method" | "data">,
  ): Promise<TResponse>;

  patch<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: Omit<HttpRequestConfig<TBody>, "url" | "method" | "data">,
  ): Promise<TResponse>;

  delete<TResponse>(
    url: string,
    config?: Omit<HttpRequestConfig, "url" | "method" | "data">,
  ): Promise<TResponse>;
}
