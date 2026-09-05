"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { UserRole } from "@/features/users/types/user";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { getDashboardRoute } from "@/features/auth/utils/get-dashboard-route";
import { Spinner } from "@/components/ui/spinner";

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="size-7" />
      </div>
    );
  }

  if (!user || !isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="size-7" />
      </div>
    );
  }

  return children;
}
