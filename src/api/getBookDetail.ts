import { createOptionalAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type { GetBookDetailParams, GetBookDetailResponse } from "@/type/search";

type GetBookDetailOptions = {
  endpoint?: string;
};

type ApiBookVoteChoice = "RECOMMEND" | "NOT_RECOMMEND";

type RawBookDetailResponse = Omit<GetBookDetailResponse, "voteSummary"> & {
  myVote?: ApiBookVoteChoice | null;
  notRecommendCount?: number;
  recommendCount?: number;
};

function mapApiVoteChoiceToUiVoteChoice(choice?: ApiBookVoteChoice | null) {
  switch (choice) {
    case "RECOMMEND":
      return "up";
    case "NOT_RECOMMEND":
      return "down";
    default:
      return null;
  }
}

export async function getBookDetail(
  { isbn }: GetBookDetailParams,
  options?: GetBookDetailOptions,
): Promise<GetBookDetailResponse> {
  const endpoint =
    options?.endpoint ?? buildPolarisApiUrl(`/api/v1/books/${isbn}`);

  const data = await httpClient.get<RawBookDetailResponse>(endpoint, {
    headers: createOptionalAuthHeaders(),
  });

  return {
    ...data,
    voteSummary: {
      upCount: data.recommendCount ?? 0,
      downCount: data.notRecommendCount ?? 0,
      userChoice: mapApiVoteChoiceToUiVoteChoice(data.myVote),
    },
  };
}
