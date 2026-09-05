"use client";

import { useQuery } from "@tanstack/react-query";

import { getModerators } from "@/features/users/api/get-moderators";

export function useModerators() {
  return useQuery({
    queryKey: ["moderators"],
    queryFn: getModerators,
  });
}