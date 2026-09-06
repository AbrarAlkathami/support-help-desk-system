"use client";

import { ApiError } from "@/components/shared/api-error";
import { Spinner } from "@/components/ui/spinner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useCategories } from "@/features/categories/hooks/use-categories";
import { useMetrics } from "@/features/metrics/hooks/use-metrics";

export function CategoryManagement() {
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();

  const {
    data: metrics,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
    error: metricsError,
  } = useMetrics();

  if (isCategoriesLoading || isMetricsLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isCategoriesError) {
    return (
      <ApiError
        variant="alert"
        title="Could not load categories"
        error={categoriesError}
      />
    );
  }

  if (isMetricsError) {
    return (
      <ApiError
        variant="alert"
        title="Could not load category ticket counts"
        error={metricsError}
      />
    );
  }
  const getTicketCount = (categoryName: string) =>
    metrics?.byCategory.find((item) => item.category === categoryName)?.count ??
    0;
  return (
    <div className="space-y-5">
      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-12 text-center">
          <p className="font-medium">No categories yet</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a category to start organizing support tickets.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-black/5 bg-white/35 shadow-sm backdrop-blur-[2px]">
          <Table>
            <TableHeader className="bg-white/25">
              <TableRow>
                <TableHead>Category</TableHead>

                <TableHead className="w-30 text-right">Tickets</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-[#F2A88D]/20">
                  <TableCell className="font-medium">{category.name}</TableCell>

                  <TableCell className="text-right font-medium">
                    {getTicketCount(category.name)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
