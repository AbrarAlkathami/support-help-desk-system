import type { UserRole } from "@/features/users/types/user";

export function getDashboardRoute(role: UserRole) {
  if (role === "admin") return "/admin";
  if (role === "moderator") return "/moderator";

  return "/user";
}