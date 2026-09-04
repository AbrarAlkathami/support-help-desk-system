"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { UserRole } from "@/features/users/types/user";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { getDashboardRoute } from "@/features/auth/utils/get-dashboard-route";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();

  const { data: user, isLoading, isError } = useCurrentUser();

  const isAllowed = user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (isLoading) return;

    if (isError || !user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace(getDashboardRoute(user.role));
    }
  }, [user, isLoading, isError, allowedRoles, router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user || !isAllowed) {
    return null;
  }

  return children;
}
