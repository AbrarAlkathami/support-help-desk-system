"use client";

import { ShieldCheck, UserRound, UserRoundCog, UserX } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/components/shared/api-error";

import { useUsers } from "@/features/users/hooks/use-users";

export function AdminAccountOverview() {
  const { data: users = [], isLoading, isError, error } = useUsers();

  if (isLoading) {
    return <Skeleton className="h-80 rounded-xl" />;
  }

  if (isError) {
    return (
      <ApiError
        variant="alert"
        title="Could not load account overview"
        error={error}
      />
    );
  }

  const userCount = users.filter((user) => user.role === "user").length;

  const moderatorCount = users.filter(
    (user) => user.role === "moderator",
  ).length;

  const adminCount = users.filter((user) => user.role === "admin").length;

  const inactiveCount = users.filter((user) => !user.isActive).length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Account overview</CardTitle>

        <CardDescription>Current platform access by role.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <AccountRow label="Users" value={userCount} icon={UserRound} />

        <AccountRow
          label="Moderators"
          value={moderatorCount}
          icon={UserRoundCog}
        />

        <AccountRow label="Admins" value={adminCount} icon={ShieldCheck} />

        <AccountRow label="Inactive" value={inactiveCount} icon={UserX} />
      </CardContent>
    </Card>
  );
}

function AccountRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof UserRound;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-md bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>

        <span className="text-sm font-medium">{label}</span>
      </div>

      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}
