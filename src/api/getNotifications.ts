import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type { NotificationsResponse } from "@/type/notification";

type GetNotificationsParams = {
  cursor?: string;
  limit?: number;
};

export async function getNotifications(params: GetNotificationsParams = {}) {
  return httpClient.get<NotificationsResponse>(
    buildPolarisApiUrl("/api/v1/notifications"),
    {
      headers: createAuthHeaders(),
      params,
    },
  );
}
