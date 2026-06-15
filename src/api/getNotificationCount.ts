import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type { NotificationCountResponse } from "@/type/notification";

export async function getNotificationCount() {
  return httpClient.get<NotificationCountResponse>(
    buildPolarisApiUrl("/api/v1/notifications/count"),
    {
      headers: createAuthHeaders(),
    },
  );
}
