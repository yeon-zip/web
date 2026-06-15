import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type {
  GetNearbyBookAvailabilityParams,
  GetNearbyBookAvailabilityResponse,
} from "@/type/search";

type GetNearbyBookAvailabilityOptions = {
  endpoint?: string;
};

export async function getNearbyBookAvailability(
  {
    isbn,
    latitude,
    longitude,
    radiusKm = 5,
    loanAvailable,
    openNow,
    cursor,
    limit,
  }: GetNearbyBookAvailabilityParams,
  options?: GetNearbyBookAvailabilityOptions,
): Promise<GetNearbyBookAvailabilityResponse> {
  const endpoint =
    options?.endpoint ?? buildPolarisApiUrl("/api/v1/book-availability");

  return httpClient.get<GetNearbyBookAvailabilityResponse>(endpoint, {
    params: {
      isbn,
      latitude,
      longitude,
      radiusKm,
      loanAvailable,
      openNow,
      cursor,
      limit,
    },
  });
}
