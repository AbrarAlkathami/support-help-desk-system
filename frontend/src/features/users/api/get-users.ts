import { apiClient } from "@/lib/api/api-client";

import type {
  User,
  UserRole,
} from "@/features/users/types/user";

type UserApiResponse = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
};

export async function getUsers(): Promise<User[]> {
  const response =
    await apiClient<UserApiResponse[]>("/users");

  return response.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.is_active,
  }));
}