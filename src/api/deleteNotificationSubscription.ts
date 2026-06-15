import { createAuthHeaders } from "@/api/authHeaders";
import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";

type DeleteNotificationSubscriptionParams = {
  isbn: string;
  libraryId: number;
};

export async function deleteNotificationSubscription(
  params: DeleteNotificationSubscriptionParams,
) {
  return httpClient.delete<void>(
    buildPolarisApiUrl("/api/v1/notifications/subscriptions"),
    {
      headers: createAuthHeaders(),
      params,
    },
  );
}
