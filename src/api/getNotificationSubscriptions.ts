import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type { NotificationSubscriptionItem } from "@/type/notification";

export async function getNotificationSubscriptions() {
  return httpClient.get<NotificationSubscriptionItem[]>(
    buildPolarisApiUrl("/api/v1/notifications/subscriptions/me"),
    {
      headers: createAuthHeaders(),
    },
  );
}
