"use client";

import { useEffect, useState } from "react";

import type { TicketStatus } from "@/features/tickets/types/ticket";

interface TicketSlaProps {
  dueAt: string;
  isOverdue: boolean;
  status: TicketStatus;
}

export function TicketSla({ dueAt, isOverdue, status }: TicketSlaProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const updateNow = () => {
      setNow(Date.now());
    };

    const timeout = window.setTimeout(updateNow, 0);
    const interval = window.setInterval(updateNow, 60_000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  if (status === "resolved" || status === "closed") {
    return (
      <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        Completed
      </span>
    );
  }

  if (now === null) {
    return (
      <span className="text-xs text-muted-foreground">
        {isOverdue ? "Overdue" : "Due"}
      </span>
    );
  }

  const difference = new Date(dueAt).getTime() - now;

  const absoluteMinutes = Math.ceil(Math.abs(difference) / (1000 * 60));
  const days = Math.floor(absoluteMinutes / (60 * 24));
  const hours = Math.floor((absoluteMinutes % (60 * 24)) / 60);
  const minutes = absoluteMinutes % 60;

  let time: string;

  if (days > 0) {
    time = `${days}d ${hours}h`;
  } else if (hours > 0) {
    time = `${hours}h ${minutes}m`;
  } else {
    time = `${minutes}m`;
  }

  if (isOverdue) {
    return (
      <span className="inline-flex whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
        Overdue · {time}
      </span>
    );
  }

  if (absoluteMinutes <= 60) {
    return (
      <span className="inline-flex whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        Due soon · {time}
      </span>
    );
  }

  return (
    <span className="inline-flex whitespace-nowrap rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
      Due in {time}
    </span>
  );
}
