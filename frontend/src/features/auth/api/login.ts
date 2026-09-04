import { apiClient } from "@/lib/api/api-client";
import type { LoginFormValues } from "../schemas/login-schema";
import type {User} from "@/features/users/types/user";

export function login(data: LoginFormValues) {
  const response = apiClient<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response;
}