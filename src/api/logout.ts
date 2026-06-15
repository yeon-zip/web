import { createSessionAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";

export async function logout() {
  return httpClient.delete<void>(
    buildPolarisApiUrl("/api/v1/auth/logout"),
    {
      headers: createSessionAuthHeaders(),
    },
  );
}
