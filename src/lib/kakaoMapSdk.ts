"use client";

export type KakaoLatLng = {
  getLat: () => number;
  getLng: () => number;
};

export type KakaoMap = {
  getCenter: () => KakaoLatLng;
  relayout: () => void;
  setCenter: (latlng: KakaoLatLng) => void;
};

export type KakaoMarker = {
  getPosition: () => KakaoLatLng;
  setMap: (map: KakaoMap | null) => void;
  setPosition: (position: KakaoLatLng) => void;
};

export type KakaoSdk = {
  maps: {
    LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
    Map: new (
      container: HTMLElement,
      options: { center: KakaoLatLng; level: number },
    ) => KakaoMap;
    Marker: new (options: {
      draggable?: boolean;
      position: KakaoLatLng;
      map: KakaoMap;
    }) => KakaoMarker;
    event: {
      addListener: (
        target: KakaoMap | KakaoMarker,
        eventName: string,
        callback: () => void,
      ) => void;
    };
    load: (callback: () => void) => void;
  };
};

declare global {
  interface Window {
    kakao?: KakaoSdk;
  }
}

const KAKAO_MAP_SCRIPT_ID = "kakao-map-sdk";
const kakaoMapAppKey =
  process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ??
  process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

let kakaoMapSdkPromise: Promise<KakaoSdk> | null = null;

export function loadKakaoMapSdk() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("브라우저에서만 지도를 표시할 수 있어요."));
  }

  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }

  if (!kakaoMapAppKey) {
    return Promise.reject(
      new Error("카카오맵 JavaScript 키가 설정되지 않았어요."),
    );
  }

  if (!kakaoMapSdkPromise) {
    kakaoMapSdkPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);

      if (existingScript) {
        existingScript.addEventListener("load", () => {
          window.kakao?.maps.load(() => {
            if (window.kakao) {
              resolve(window.kakao);
            }
          });
        });
        existingScript.addEventListener("error", () => {
          reject(new Error("카카오맵 스크립트를 불러오지 못했어요."));
        });
        return;
      }

      const script = document.createElement("script");
      script.id = KAKAO_MAP_SCRIPT_ID;
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapAppKey}&autoload=false`;
      script.onload = () => {
        window.kakao?.maps.load(() => {
          if (window.kakao) {
            resolve(window.kakao);
            return;
          }

          reject(new Error("카카오맵 SDK를 초기화하지 못했어요."));
        });
      };
      script.onerror = () => {
        reject(new Error("카카오맵 스크립트를 불러오지 못했어요."));
      };

      document.head.appendChild(script);
    });
  }

  return kakaoMapSdkPromise;
}
