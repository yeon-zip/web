import { buildPolarisApiUrl } from "@/api/apiConfig";
import { httpClient } from "@/api/httpClient";
import type {
  GetLibraryDetailParams,
  GetLibraryDetailResponse,
} from "@/type/search";

type GetLibraryDetailOptions = {
  endpoint?: string;
};

export async function getLibraryDetail(
  { libraryId }: GetLibraryDetailParams,
  options?: GetLibraryDetailOptions,
): Promise<GetLibraryDetailResponse> {
  const endpoint =
    options?.endpoint ?? buildPolarisApiUrl(`/api/v1/libraries/${libraryId}`);

  return httpClient.get<GetLibraryDetailResponse>(endpoint);
}
