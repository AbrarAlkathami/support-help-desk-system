import { apiClient } from "@/lib/api/api-client";
import type { User } from "@/features/users/types/user";

export function getCurrentUser() {
  return apiClient<User>("/auth/me");
}