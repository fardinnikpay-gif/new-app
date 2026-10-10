import { CircleAlert } from "lucide-react";
import { cx } from "../../utils/cx";
import Button from "./Button";

// props: { message, onRetry, className }
export default function ErrorState({ message = "Something went wrong.", onRetry, className }) {
  return (
    <div role="alert" className={cx("flex flex-col items-center gap-3 px-4 py-16 text-center", className)}>
      <CircleAlert aria-hidden="true" className="h-10 w-10 text-danger" />
      <p className="max-w-sm text-neutral-600">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}