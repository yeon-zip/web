import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";

export async function bookmarkLibrary(libraryId: string) {
  return httpClient.post<void>(
    buildPolarisApiUrl(`/api/v1/libraries/${libraryId}/bookmark`),
    undefined,
    {
      headers: createAuthHeaders(),
    },
  );
}
