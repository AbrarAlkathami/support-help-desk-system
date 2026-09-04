import { RoleGuard } from "@/features/auth/components/role-guard";

function ModeratorLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={["moderator"]}>{children}</RoleGuard>;
}

export default ModeratorLayout;
