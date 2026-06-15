import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";

export async function unbookmarkBook(isbn: string) {
  return httpClient.delete<void>(
    buildPolarisApiUrl(`/api/v1/books/${isbn}/bookmark`),
    {
      headers: createAuthHeaders(),
    },
  );
}
