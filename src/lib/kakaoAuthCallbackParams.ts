export type KakaoAuthCallbackParams = {
  code: string;
  targetId: string;
};

function getCallbackSearchParams() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search);
}

export function getKakaoAuthCallbackParams(): KakaoAuthCallbackParams | null {
  const params = getCallbackSearchParams();

  if (!params) {
    return null;
  }

  const code = params.get("code");
  const targetId = params.get("targetId");

  if (!code || !targetId) {
    return null;
  }

  return {
    code,
    targetId,
  };
}

export function hasKakaoAuthCallbackParams() {
  return Boolean(getKakaoAuthCallbackParams());
}
