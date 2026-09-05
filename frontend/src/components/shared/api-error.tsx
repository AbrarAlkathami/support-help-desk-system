import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ApiErrorProps {
  error?: Error | null;
  fallback?: string;
  title?: string;
  variant?: "alert" | "inline";
  className?: string;
}

export function ApiError({
  error,
  fallback = "Something went wrong. Please try again.",
  title = "Something went wrong",
  variant = "inline",
  className = "",
}: ApiErrorProps) {
  const message = error?.message || fallback;

  if (variant === "alert") {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return <p className={`text-sm text-destructive ${className}`}>{message}</p>;
}
