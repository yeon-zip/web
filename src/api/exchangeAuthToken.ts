import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type {
  AuthTokenResponse,
  ExchangeAuthTokenRequest,
} from "@/type/auth";

function validateAuthTokenResponse(
  response: AuthTokenResponse,
): AuthTokenResponse {
  if (!response.accessToken || !response.refreshToken) {
    throw new Error("Auth token response is missing required tokens.");
  }

  return response;
}

export async function exchangeAuthToken(request: ExchangeAuthTokenRequest) {
  const response = await httpClient.post<
    AuthTokenResponse,
    ExchangeAuthTokenRequest
  >(buildPolarisApiUrl("/api/v1/auth/exchange"), request);

  return validateAuthTokenResponse(response);
}
