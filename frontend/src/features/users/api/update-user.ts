import { apiClient } from "@/lib/api/api-client";

import type {
  User,
  UserRole,
} from "@/features/users/types/user";

export type UpdateUserData = {
  role?: UserRole;
  isActive?: boolean;
};

type UserApiResponse = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
};

export async function updateUser(
  userId: string,
  data: UpdateUserData,
): Promise<User> {
  const response =
    await apiClient<UserApiResponse>(
      `/users/${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          ...(data.role !== undefined && {
            role: data.role,
          }),

          ...(data.isActive !== undefined && {
            is_active: data.isActive,
          }),
        }),
      },
    );

  return {
    id: response.id,
    name: response.name,
    email: response.email,
    role: response.role,
    isActive: response.is_active,
  };
}