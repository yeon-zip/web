import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";

export async function unbookmarkLibrary(libraryId: string) {
  return httpClient.delete<void>(
    buildPolarisApiUrl(`/api/v1/libraries/${libraryId}/bookmark`),
    {
      headers: createAuthHeaders(),
    },
  );
}
