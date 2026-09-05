import { apiClient } from "@/lib/api/api-client";

export type Moderator = {
  id: string;
  name: string;
  email: string;
  role: "moderator";
  isActive: boolean;
};

type ModeratorApiResponse = {
  id: string;
  name: string;
  email: string;
  role: "moderator";
  is_active: boolean;
};

export async function getModerators(): Promise<Moderator[]> {
  const response =
    await apiClient<ModeratorApiResponse[]>(
      "/users/moderators",
    );

  return response.map((moderator) => ({
    id: moderator.id,
    name: moderator.name,
    email: moderator.email,
    role: moderator.role,
    isActive: moderator.is_active,
  }));
}