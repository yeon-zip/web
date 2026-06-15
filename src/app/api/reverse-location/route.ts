import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ message: "lat, lng 필요" }, { status: 400 });
  }

  const key = process.env.KAKAO_REST_API_KEY;

  if (!key) {
    return NextResponse.json(
      { message: "KAKAO_REST_API_KEY가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const url = new URL(
    "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json",
  );
  url.searchParams.set("x", lng);
  url.searchParams.set("y", lat);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${key}`,
    },
    cache: "no-store", // 사용자마다 위치가 다르기 때문에 캐싱하지 않음
  });

  if (!res.ok) {
    return NextResponse.json(
      { message: "좌표 기반 지역 조회에 실패했습니다." },
      { status: res.status },
    );
  }

  const data = await res.json();
  const region = data.documents?.find(
    (document: { region_type?: string }) => document.region_type === "H",
  );
  const regionName = [
    region?.region_1depth_name,
    region?.region_2depth_name,
    region?.region_3depth_name,
  ]
    .filter(Boolean)
    .join(" ");

  return NextResponse.json({ regionName: regionName || null });
}
