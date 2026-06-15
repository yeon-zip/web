import { buildPolarisApiUrl } from "@/api/apiConfig";
import { setOAuthCodeVerifier } from "@/lib/oauthCodeVerifierStorage";

type KakaoLoginRequestParams = {
  channel?: "web";
};

function createCodeVerifier() {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);

  return toBase64Url(bytes);
}

function toBase64Url(bytes: Uint8Array) {
  const binary = String.fromCharCode(...bytes);

  return window
    .btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function createCodeChallenge(codeVerifier: string) {
  const encodedVerifier = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", encodedVerifier);

  return toBase64Url(new Uint8Array(digest));
}

export async function requestKakaoLogin(params: KakaoLoginRequestParams = {}) {
  const codeVerifier = createCodeVerifier();
  const codeChallenge = await createCodeChallenge(codeVerifier);
  const loginUrl = new URL(buildPolarisApiUrl("/api/v1/auth/kakao/login"));

  setOAuthCodeVerifier(codeVerifier);
  loginUrl.searchParams.set("channel", params.channel ?? "web");
  loginUrl.searchParams.set("codeChallenge", codeChallenge);
  loginUrl.searchParams.set("codeChallengeMethod", "S256");

  window.location.assign(loginUrl.toString());
}
