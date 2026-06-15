import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type { BookmarkedLibrariesResponse } from "@/type/bookmark";

export async function getBookmarkedLibraries() {
  return httpClient.get<BookmarkedLibrariesResponse>(
    buildPolarisApiUrl("/api/v1/users/me/bookmarked-libraries"),
    {
      headers: createAuthHeaders(),
    },
  );
}
