import { apiClient } from "@/lib/api/api-client";
import type { Category } from "@/features/categories/types/category";

export async function getCategories() {
  return apiClient<Category[]>("/categories");
}