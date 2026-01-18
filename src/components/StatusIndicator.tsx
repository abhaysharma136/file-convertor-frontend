import { Loader2 } from "lucide-react";

type Props = {
  status: string | null;
  error?: string | null;
};

export default function StatusIndicator({ status, error }: Props) {
  if (error) return <p className="error">{error}</p>;
  if (!status) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-muted-foreground">
        {status === "pending" ? "Converting..." : ""}
      </span>
    </div>
  );
}
