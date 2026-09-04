import { RoleGuard } from "@/features/auth/components/role-guard";

function UserLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={["user"]}>{children}</RoleGuard>;
}

export default UserLayout;
