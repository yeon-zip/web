import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type { CreateNotificationSubscriptionRequest } from "@/type/notification";

export async function createNotificationSubscription(
  request: CreateNotificationSubscriptionRequest,
) {
  return httpClient.post<void, CreateNotificationSubscriptionRequest>(
    buildPolarisApiUrl("/api/v1/notifications/subscriptions"),
    request,
    {
      headers: createAuthHeaders(),
    },
  );
}
