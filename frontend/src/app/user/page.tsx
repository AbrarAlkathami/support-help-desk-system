import UserTicketsSection from "@/features/tickets/components/user-tickets-section";
import { CreateTicketDialog } from "@/features/tickets/components/create-ticket-dialog";
import { LogoutButton } from "@/features/auth/components/logout-button";
function UserPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">My Tickets</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track and manage your support requests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CreateTicketDialog />
            <LogoutButton />
          </div>
        </header>

        <UserTicketsSection />
      </div>
    </main>
  );
}

export default UserPage;
