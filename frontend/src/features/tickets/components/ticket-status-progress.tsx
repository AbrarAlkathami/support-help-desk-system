import { Fragment } from "react";

import type { TicketStatus } from "@/features/tickets/types/ticket";

interface TicketStatusProgressProps {
  status: TicketStatus;
}

const steps = ["Submitted", "In Progress", "Resolved"];

const statusStep: Record<TicketStatus, number> = {
  open: 0,
  in_progress: 1,
  resolved: 2,
  closed: 2,
};

export function TicketStatusProgress({ status }: TicketStatusProgressProps) {
  const currentStep = statusStep[status];

  return (
    <div>
      <div className="flex items-start">
        {steps.map((step, index) => {
          const reached = index <= currentStep;

          return (
            <Fragment key={step}>
              <div className="flex min-w-20 flex-col items-center">
                <div
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-medium ${
                    reached
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>

                <span
                  className={`mt-2 text-center text-xs ${
                    reached
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mt-3.5 h-px flex-1 ${
                    index < currentStep ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>

      {status === "closed" && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          This ticket has been closed.
        </p>
      )}
    </div>
  );
}
