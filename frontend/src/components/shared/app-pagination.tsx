"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const pageSizeOptions = [
  { label: "10 per page", value: "10" },
  { label: "20 per page", value: "20" },
  { label: "50 per page", value: "50" },
];

interface AppPaginationProps {
  page: number;
  totalPages: number;

  pageSize?: number;

  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function AppPagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: AppPaginationProps) {
  const showPageSize = pageSize !== undefined && onPageSizeChange !== undefined;

  if (totalPages <= 1 && !showPageSize) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {showPageSize && (
        <Select
          items={pageSizeOptions}
          value={String(pageSize)}
          onValueChange={(value) => {
            if (!value) return;

            onPageSizeChange(Number(value));
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>

          <SelectContent>
            {pageSizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {totalPages > 1 && (
        <Pagination className="w-auto justify-end">
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
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
