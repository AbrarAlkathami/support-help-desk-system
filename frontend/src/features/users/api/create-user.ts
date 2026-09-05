import { apiClient } from "@/lib/api/api-client";

import type {
  User,
  UserRole,
} from "@/features/users/types/user";

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type UserApiResponse = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
};

export async function createUser(
  data: CreateUserData,
): Promise<User> {
  const response =
    await apiClient<UserApiResponse>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });

  return {
    id: response.id,
    name: response.name,
    email: response.email,
    role: response.role,
    isActive: response.is_active,
  };
}