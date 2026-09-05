"use client";

import { useQuery } from "@tanstack/react-query";

import { getUsers } from "@/features/users/api/get-users";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}