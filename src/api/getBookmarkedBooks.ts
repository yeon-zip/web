import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type { BookmarkedBooksResponse } from "@/type/bookmark";

export async function getBookmarkedBooks() {
  return httpClient.get<BookmarkedBooksResponse>(
    buildPolarisApiUrl("/api/v1/users/me/bookmarked-books"),
    {
      headers: createAuthHeaders(),
    },
  );
}
