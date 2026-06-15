import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";

export async function bookmarkBook(isbn: string) {
  return httpClient.post<void>(
    buildPolarisApiUrl(`/api/v1/books/${isbn}/bookmark`),
    undefined,
    {
      headers: createAuthHeaders(),
    },
  );
}
