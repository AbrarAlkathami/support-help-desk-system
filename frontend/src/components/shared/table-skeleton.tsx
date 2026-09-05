import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 10 }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/5 bg-white/35 shadow-sm backdrop-blur-[2px]">
      <Table>
        <TableHeader className="bg-white/25">
          <TableRow className="border-b border-black/10 hover:bg-transparent">
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <TableCell key={columnIndex}>
                  <Skeleton className="h-5 w-full max-w-28" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
