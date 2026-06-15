export type ExchangeAuthTokenRequest = {
  code: string;
  targetId: string;
  codeVerifier: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  userId?: number;
};
