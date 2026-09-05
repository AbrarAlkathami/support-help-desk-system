"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createCategory } from "@/features/categories/api/create-category";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}