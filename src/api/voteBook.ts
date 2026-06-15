import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type { BookVoteChoice } from "@/type/search";

type ApiBookVoteChoice = "RECOMMEND" | "NOT_RECOMMEND";

type VoteBookRequest = {
  voteType: ApiBookVoteChoice;
};

function mapVoteChoice(choice: BookVoteChoice): ApiBookVoteChoice {
  return choice === "up" ? "RECOMMEND" : "NOT_RECOMMEND";
}

export async function voteBook(isbn: string, choice: BookVoteChoice) {
  return httpClient.put<void, VoteBookRequest>(
    buildPolarisApiUrl(`/api/v1/books/${isbn}/vote`),
    { voteType: mapVoteChoice(choice) },
    {
      headers: createAuthHeaders(),
    },
  );
}
