import { CircleDashed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { UserIdentity } from "@/components/shared/user-identity";

interface TicketAssigneeBadgeProps {
  assignee: {
    id: string;
    name: string;
    email?: string | null;
  } | null;

  currentUserId?: string;
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
      <UserIdentity name={assignee.name} email={assignee.email} size="sm" />

      {isMe && (
        <Badge variant="secondary" className="text-xs">
          You
        </Badge>
      )}
    </div>
  );
}
