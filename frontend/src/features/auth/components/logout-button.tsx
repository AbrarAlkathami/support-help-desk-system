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
      className="bg-transparent border-2"
    >
      {logoutMutation.isPending ? "" : <LogOut />}
    </Button>
  );
}
