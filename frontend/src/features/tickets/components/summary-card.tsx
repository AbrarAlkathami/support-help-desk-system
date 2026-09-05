import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
}

export function SummaryCard({ title, value, icon: Icon }: SummaryCardProps) {
  return (
    <Card className="rounded-xl">
      <CardContent className="flex items-center justify-between px-5 py-1">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>

        {Icon && (
          <Icon
            className="size-8 shrink-0 text-muted-foreground/40"
            strokeWidth={1.4}
          />
        )}
      </CardContent>
    </Card>
  );
}
