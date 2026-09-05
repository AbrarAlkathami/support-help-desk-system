import { CircleDashed } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

interface TicketAssigneeBadgeProps {
  assignee: {
    id: string;
    name: string;
  } | null;

  currentUserId?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TicketAssigneeBadge({
  assignee,
  currentUserId,
}: TicketAssigneeBadgeProps) {
  if (!assignee) {
    return (
      <Badge
        variant="outline"
        className="gap-1.5 rounded-full font-normal text-muted-foreground"
      >
        <CircleDashed className="size-3.5" />
        Unassigned
      </Badge>
    );
  }

  const isMe = assignee.id === currentUserId;

  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-7">
        <AvatarFallback className="text-xs">
          {getInitials(assignee.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium">{assignee.name}</span>

        {isMe && (
          <Badge variant="secondary" className="text-xs">
            You
          </Badge>
        )}
      </div>
    </div>
  );
}
