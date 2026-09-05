"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateUser,
  type UpdateUserData,
} from "@/features/users/api/update-user";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserData;
    }) => updateUser(userId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["moderators"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },
  });
}