import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type {
  GetNearbyLibrariesParams,
  GetNearbyLibrariesResponse,
} from "@/type/search";

type GetNearbyLibrariesOptions = {
  endpoint?: string;
};

export async function getNearbyLibrarys(
  {
    latitude,
    longitude,
    radiusKm = 5,
    cursor,
    limit,
  }: GetNearbyLibrariesParams,
  options?: GetNearbyLibrariesOptions,
): Promise<GetNearbyLibrariesResponse> {
  const endpoint = options?.endpoint ?? buildPolarisApiUrl("/api/v1/libraries/nearby");

  return httpClient.get<GetNearbyLibrariesResponse>(endpoint, {
    params: {
      latitude,
      longitude,
      radiusKm,
      cursor,
      limit,
    },
  });
}

