"use client";

import {
  Bar,
  BarChart,
  BarShapeProps,
  CartesianGrid,
  Pie,
  PieChart,
  Rectangle,
  XAxis,
} from "recharts";
import type { TicketStatus } from "@/features/tickets/types/ticket";
import { ApiError } from "@/components/shared/api-error";
import { CircleAlert, CircleDot, Inbox, Tickets } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminAccountOverview } from "@/features/users/components/admin-account-overview";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { Skeleton } from "@/components/ui/skeleton";

import { useMetrics } from "@/features/metrics/hooks/use-metrics";
import { useQueueSummary } from "@/features/tickets/hooks/use-queue-summary";
import { useTickets } from "@/features/tickets/hooks/use-tickets";

import { SummaryCard } from "@/features/tickets/components/summary-card";
import { TicketStatusBadge } from "@/features/tickets/components/ticket-status-badge";
import { TicketPriorityBadge } from "@/features/tickets/components/ticket-priority-badge";
import { TicketSla } from "@/features/tickets/components/ticket-sla";

const statusChartConfig = {
  count: {
    label: "Tickets",
  },
} satisfies ChartConfig;

const statusColors: Record<TicketStatus, string> = {
  open: "#3b82f6", // blue-500
  in_progress: "#f59e0b", // amber-500
  resolved: "#10b981", // emerald-500
  closed: "#71717a", // zinc-500
};

const categoryColors = [
  "#60a5fa", // blue
  "#34d399", // emerald
  "#fbbf24", // amber
  "#a78bfa", // violet
  "#fb7185", // rose
];

const CategoryBarShape = (props: BarShapeProps) => {
  const color = categoryColors[props.index % categoryColors.length];

  return <Rectangle {...props} fill={color} radius={[6, 6, 0, 0]} />;
};

const categoryChartConfig = {
  count: {
    label: "Tickets",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function AdminMetrics() {
  const {
    data: metrics,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
    error: metricsError,
  } = useMetrics();

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
  } = useQueueSummary();

  const {
    data: recentTickets,
    isLoading: isRecentTicketsLoading,
    isError: isRecentTicketsError,
    error: recentTicketsError,
  } = useTickets({
    page: 1,
    pageSize: 5,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  if (isMetricsLoading || isSummaryLoading || isRecentTicketsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[360px] rounded-xl" />
          <Skeleton className="h-[360px] rounded-xl" />
        </div>

        <Skeleton className="h-[320px] rounded-xl" />
      </div>
    );
  }

  if (isMetricsError) {
    return (
      <ApiError
        variant="alert"
        title="Could not load metrics"
        error={metricsError}
      />
    );
  }

  if (isSummaryError) {
    return (
      <ApiError
        variant="alert"
        title="Could not load queue summary"
        error={summaryError}
      />
    );
  }

  if (isRecentTicketsError) {
    return (
      <ApiError
        variant="alert"
        title="Could not load recent tickets"
        error={recentTicketsError}
      />
    );
  }

  if (!metrics || !summary) {
    return null;
  }

  const getStatusCount = (status: string) =>
    metrics.byStatus.find((item) => item.status === status)?.count ?? 0;

  const statusChartData = metrics.byStatus.map((item) => ({
    ...item,
    label: formatStatus(item.status),
    fill: statusColors[item.status as TicketStatus] ?? "#a1a1aa",
  }));

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="All tickets"
          value={metrics.totalTickets}
          icon={Tickets}
        />

        <SummaryCard
          title="Open tickets"
          value={getStatusCount("open")}
          icon={CircleDot}
        />

        <SummaryCard
          title="Unassigned"
          value={summary.unassigned}
          icon={Inbox}
        />

        <SummaryCard
          title="Overdue"
          value={summary.overdue}
          icon={CircleAlert}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tickets by category</CardTitle>

            <CardDescription>
              Distribution of support requests by category and status.
            </CardDescription>
          </CardHeader>

          <ChartContainer
            config={categoryChartConfig}
            className="h-[280px] w-full"
          >
            <BarChart data={metrics.byCategory}>
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  value.length > 14 ? `${value.slice(0, 14)}…` : value
                }
              />

              <Bar dataKey="count" shape={CategoryBarShape} />

              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket status</CardTitle>

            <CardDescription>
              Current ticket distribution by workflow status.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer
              config={statusChartConfig}
              className="mx-auto h-280px w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="label" hideLabel />}
                />

                <Pie
                  data={statusChartData}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={65}
                  outerRadius={100}
                  strokeWidth={4}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent tickets</CardTitle>
            <CardDescription>
              Latest support requests across the platform.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-1">
              {(recentTickets?.items ?? []).map((ticket) => (
                <div
                  key={ticket.id}
                  className="group grid grid-cols-[4px_110px_minmax(0,1fr)_110px_160px] items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted/40"
                >
                  {/* Status indicator */}
                  <div
                    className={`h-10 w-1 rounded-full ${
                      ticket.isOverdue
                        ? "bg-red-300"
                        : getStatusIndicator(ticket.status)
                    }`}
                  />

                  {/* Date */}
                  <div className="text-xs font-medium">
                    {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </div>

                  {/* Ticket info */}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {ticket.subject}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {ticket.requester.name} · {ticket.category.name}
                    </p>
                  </div>

                  {/* Status / SLA */}
                  <div className="flex justify-center">
                    <TicketStatusBadge status={ticket.status} />
                  </div>

                  <div className="text-right">
                    <TicketSla
                      dueAt={ticket.slaDueAt}
                      isOverdue={ticket.isOverdue}
                      status={ticket.status}
                    />
                  </div>
                </div>
              ))}

              {recentTickets?.items.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No tickets yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <AdminAccountOverview />
      </div>
    </div>
  );
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusIndicator(status: string) {
  const styles: Record<string, string> = {
    open: "bg-blue-300",
    in_progress: "bg-amber-300",
    resolved: "bg-emerald-300",
    closed: "bg-zinc-300",
  };

  return styles[status] ?? "bg-zinc-300";
}
