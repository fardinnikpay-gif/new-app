import { RefreshCw, TriangleAlert } from "lucide-react";
import Button from "./Button";

export default function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-danger-bg bg-white px-6 py-12 text-center"
    >
      <TriangleAlert className="size-10 text-danger" aria-hidden="true" />
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {message && <p className="max-w-sm text-sm text-gray-500">{message}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  );
}