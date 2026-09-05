"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AppPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AppPagination({
  page,
  totalPages,
  onPageChange,
}: AppPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-4 justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();

              if (page > 1) {
                onPageChange(page - 1);
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

                  onPageChange(pageNumber);
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
                onPageChange(page + 1);
              }
            }}
            aria-disabled={page >= totalPages}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
