export const POLARIS_SERVER_BASE_URL = "https://api.k-polaris.life";

export function buildPolarisApiUrl(path: string) {
  return `${POLARIS_SERVER_BASE_URL}${path}`;
}
