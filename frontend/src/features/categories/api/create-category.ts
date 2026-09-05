import { apiClient } from "@/lib/api/api-client";

export type Category = {
  id: string;
  name: string;
};

export async function createCategory(
  name: string,
): Promise<Category> {
  return apiClient<Category>(
    "/categories",
    {
      method: "POST",
      body: JSON.stringify({
        name,
      }),
    },
  );
}