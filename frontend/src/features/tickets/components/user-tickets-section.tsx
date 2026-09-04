"use client";
import { TicketIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserTicketTable } from "@/features/tickets/components/user-ticket-table";
import { useTickets } from "@/features/tickets/hooks/use-tickets";
import type { TicketStatus } from "@/features/tickets/types/ticket";
import { UserTicketFilters } from "@/features/tickets/components/user-ticket-filters";
import { TicketDetailsDialog } from "@/features/tickets/components/ticket-details-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function UserTicketsSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = 10;
  const search = searchParams.get("search") ?? "";
  const statusParam = searchParams.get("status");
  const status = statusParam ? (statusParam as TicketStatus) : undefined;
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { data, isLoading, isFetching, isError, error } = useTickets({
    page,
    pageSize,
    search: search || undefined,
    status: status ? [status] : undefined,
  });
  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;
  const [searchInput, setSearchInput] = useState(search);
  const hasActiveFilters = Boolean(search || status);
  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const value = searchInput.trim();

      if (value === search) {
        return;
      }

      updateParams({
        search: value || undefined,
        page: "1",
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput, search, updateParams]);

  if (isLoading) {
    return <p>Loading tickets...</p>;
  }

  if (isError) {
    return <p className="text-sm text-destructive">{error.message}</p>;
  }

  return (
    <section className="mt-8">
      <UserTicketFilters
        search={searchInput}
        status={status}
        onSearchChange={setSearchInput}
        onStatusChange={(value) => {
          updateParams({
            status: value,
            page: "1",
          });
        }}
      />
      {data?.total === 0 ? (
        <Empty className="mt-4 border bg-background">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TicketIcon />
            </EmptyMedia>

            <EmptyTitle>
              {hasActiveFilters ? "No tickets found" : "No tickets yet"}
            </EmptyTitle>

            <EmptyDescription>
              {hasActiveFilters
                ? "No tickets match your current search or filters."
                : "Create your first support ticket to get started."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="mt-6">
          <UserTicketTable
            tickets={data?.items ?? []}
            onTicketClick={setSelectedTicketId}
          />
        </div>
      )}
      {totalPages > 1 && (
        <Pagination className="mt-4 justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();

                  if (page > 1) {
                    updateParams({
                      page: String(page - 1),
                    });
                  }
                }}
                aria-disabled={page === 1}
                className={
                  page === 1 ? "pointer-events-none opacity-50" : undefined
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={page === pageNumber}
                    onClick={(event) => {
                      event.preventDefault();
                      updateParams({
                        page: String(pageNumber),
                      });
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();

                  if (page < totalPages) {
                    updateParams({
                      page: String(page + 1),
                    });
                  }
                }}
                aria-disabled={page >= totalPages}
                className={
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <TicketDetailsDialog
        ticketId={selectedTicketId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTicketId(null);
          }
        }}
      />
    </section>
  );
}

export default UserTicketsSection;
