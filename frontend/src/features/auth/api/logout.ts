import { apiClient } from "@/lib/api/api-client";

export function logout() {
  return apiClient<void>("/auth/logout", {
    method: "POST",
  });
}