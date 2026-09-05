"use client";

import { ApiError } from "@/components/shared/api-error";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

import { CreateUserDialog } from "@/features/users/components/create-user-dialog";

const roleOptions = [
  { label: "User", value: "user" },
  { label: "Moderator", value: "moderator" },
  { label: "Admin", value: "admin" },
];

export function UsersManagement() {
  const { data: users = [], isLoading, isError, error } = useUsers();

  const mutation = useUpdateUser();

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

  const changeRole = (userId: string, role: UserRole) => {
    mutation.mutate(
      {
        userId,
        data: { role },
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Accounts</h2>

          <p className="text-sm text-muted-foreground">
            Manage users and support agents.
          </p>
        </div>

        <CreateUserDialog />
      </div>

      {mutation.isError && <ApiError error={mutation.error} />}

      <div className="overflow-hidden rounded-xl border border-black/5 bg-white/35 shadow-sm backdrop-blur-[2px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>
                  <Select
                    items={roleOptions}
                    value={user.role}
                    disabled={mutation.isPending}
                    onValueChange={(value) => {
                      if (!value) return;

                      changeRole(user.id, value as UserRole);
                    }}
                  >
                    <SelectTrigger className="w-150px">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={mutation.isPending}
                    onClick={() => toggleActive(user.id, user.isActive)}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
