import { apiGet } from "./apiClient.js";

export function getHello(name, signal) {
  const query = new URLSearchParams({ name });
  return apiGet(`/api/hello?${query.toString()}`, signal);
}
