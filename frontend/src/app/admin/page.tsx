import { LogoutButton } from "@/features/auth/components/logout-button";

import { AdminDashboard } from "@/features/admin/components/admin-dashboard";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Administration</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage platform access, configuration and support operations.
            </p>
          </div>

          <LogoutButton />
        </header>

        <div className="mt-8">
          <AdminDashboard />
        </div>
      </div>
    </main>
  );
}
