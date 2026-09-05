import { LogoutButton } from "@/features/auth/components/logout-button";
import { QueueSummary } from "@/features/tickets/components/queue-summary";
import { TicketQueue } from "@/features/tickets/components/ticket-queue";

function ModeratorPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Support Queue</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage incoming support requests and assignments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <LogoutButton />
          </div>
        </header>

        <section className="mt-6">
          <QueueSummary />
        </section>

        <section className="mt-6">
          <TicketQueue />
        </section>
      </div>
    </main>
  );
}

export default ModeratorPage;
