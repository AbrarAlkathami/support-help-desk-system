"use client";

import { UserIdentity } from "@/components/shared/user-identity";
import { DataTableActions } from "@/components/shared/data-table-actions";
import { ApiError } from "@/components/shared/api-error";

import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useUsers } from "@/features/users/hooks/use-users";
import { useUpdateUser } from "@/features/users/hooks/use-update-user";

import type { UserRole } from "@/features/users/types/user";

const roleOptions: {
  label: string;
  value: UserRole;
}[] = [
  {
    label: "User",
    value: "user",
  },
  {
    label: "Moderator",
    value: "moderator",
  },
  {
    label: "Admin",
    value: "admin",
  },
];

const roleLabels: Record<UserRole, string> = {
  user: "User",
  moderator: "Moderator",
  admin: "Admin",
};

export function UsersManagement() {
  const { data: users = [], isLoading, isError, error } = useUsers();

  const mutation = useUpdateUser();

  const changeRole = (userId: string, role: UserRole) => {
    mutation.mutate(
      {
        userId,
        data: {
          role,
        },
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Role updated",
            description: "The account role was updated successfully.",
            type: "success",
          });
        },
      },
    );
  };

  const toggleActive = (userId: string, isActive: boolean) => {
    mutation.mutate(
      {
        userId,
        data: {
          isActive: !isActive,
        },
      },
      {
        onSuccess: () => {
          toast.add({
            title: isActive ? "Account deactivated" : "Account activated",

            description: "The account status was updated successfully.",

            type: "success",
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError) {
    return (
      <ApiError variant="alert" title="Could not load accounts" error={error} />
    );
  }

  return (
    <div className="space-y-4">
      {mutation.isError && <ApiError error={mutation.error} />}

      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[280px] px-4">Account</TableHead>

              <TableHead className="min-w-[130px] px-4">Role</TableHead>

              <TableHead className="min-w-[120px] px-4">Status</TableHead>

              <TableHead className="w-[52px] px-3">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="h-[72px] transition-colors hover:bg-muted/40"
              >
                <TableCell className="px-4 py-4">
                  <UserIdentity name={user.name} email={user.email} />
                </TableCell>

                <TableCell className="px-4 py-4">
                  <Badge
                    variant="outline"
                    className="rounded-full px-2.5 font-medium"
                  >
                    {roleLabels[user.role]}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-4">
                  <Badge
                    variant="outline"
                    className={
                      user.isActive
                        ? "rounded-full border-emerald-200 bg-emerald-50 px-2.5 text-emerald-700"
                        : "rounded-full border-zinc-200 bg-zinc-50 px-2.5 text-zinc-600"
                    }
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell className="px-3 py-4 text-right">
                  <DataTableActions
                    isPending={mutation.isPending}
                    label={`Actions for ${user.name}`}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Account actions</DropdownMenuLabel>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Change role
                        </DropdownMenuSubTrigger>

                        <DropdownMenuSubContent>
                          <DropdownMenuGroup>
                            {roleOptions.map((option) => (
                              <DropdownMenuItem
                                key={option.value}
                                disabled={user.role === option.value}
                                onClick={() =>
                                  changeRole(user.id, option.value)
                                }
                              >
                                {option.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        disabled={mutation.isPending}
                        className={
                          user.isActive
                            ? "text-destructive focus:text-destructive"
                            : undefined
                        }
                        onClick={() => toggleActive(user.id, user.isActive)}
                      >
                        {user.isActive
                          ? "Deactivate account"
                          : "Activate account"}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DataTableActions>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
