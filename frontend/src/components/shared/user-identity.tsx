import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserIdentityProps = {
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
  size?: "sm" | "md";
};

export function UserIdentity({ name, email, avatarUrl }: UserIdentityProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar className="size-6">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}

        <AvatarFallback className="text-[10px] font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>

        {email && (
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        )}
      </div>
    </div>
  );
}
