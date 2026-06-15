import { NextRequest, NextResponse } from "next/server";

type KakaoAddressDocument = {
  address_name: string;
  x: string;
  y: string;
  address?: {
    address_name: string;
  };
  road_address?: {
    address_name: string;
  };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ message: "query가 필요합니다." }, { status: 400 });
  }

  const key = process.env.KAKAO_REST_API_KEY;

  if (!key) {
    return NextResponse.json(
      { message: "KAKAO_REST_API_KEY가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const url = new URL("https://dapi.kakao.com/v2/local/search/address.json");
  url.searchParams.set("query", query);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `KakaoAK ${key}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "주소 검색에 실패했습니다." },
      { status: response.status },
    );
  }

  const data = await response.json();
  const documents = (data.documents ?? []).map((document: KakaoAddressDocument) => ({
    addressName: document.address_name,
    roadAddressName: document.road_address?.address_name ?? null,
    lotNumberAddressName: document.address?.address_name ?? null,
    longitude: document.x,
    latitude: document.y,
  }));

  return NextResponse.json({ documents });
}
