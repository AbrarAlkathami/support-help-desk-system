"use client";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";

export function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <Button
      variant="outline"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className="rounded-full bg-trinidad-500 px-4 text-white shadow-none hover:bg-trinidad-600"
    >
      {logoutMutation.isPending ? (
        ""
      ) : (
        <LogOut className="size-4 text-white group-hover:text-white" />
      )}
    </Button>
  );
}
