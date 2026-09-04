import { RoleGuard } from "@/features/auth/components/role-guard";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={["admin"]}>{children}</RoleGuard>;
}

export default AdminLayout;
