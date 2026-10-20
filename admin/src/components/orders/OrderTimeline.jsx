import { Check, X } from "lucide-react";
import { CANCELLED_STATUS, ORDER_FLOW, ORDER_STATUS_LABELS } from "../../utils/constants";
import { cx } from "../../utils/cx";
import { formatDateTime } from "../../utils/format";

const MARKER = {
  done: "bg-success-fg text-white",
  current: "bg-primary text-white ring-4 ring-primary/20",
  upcoming: "border-2 border-gray-300 bg-white",
  cancelled: "bg-danger text-white ring-4 ring-danger/20",
};
const STATE_TEXT = {
  done: "completed",
  current: "current step",
  upcoming: "not reached yet",
  cancelled: "order cancelled",
};
const FIRST_STEP = ORDER_FLOW[0];

// The API has no status history, so the steps are derived from the current status.
const buildSteps = (status) => {
  if (status === CANCELLED_STATUS) {
    return [
      { status: FIRST_STEP, state: "done" },
      { status: CANCELLED_STATUS, state: "cancelled" },
    ];
  }

  const currentIndex = ORDER_FLOW.indexOf(status);
  const finished = currentIndex === ORDER_FLOW.length - 1;

  return ORDER_FLOW.map((step, index) => {
    if (finished || index < currentIndex) return { status: step, state: "done" };
    return { status: step, state: index === currentIndex ? "current" : "upcoming" };
  });
};

export default function OrderTimeline({ status, createdAt }) {
  return (
    <ol className="space-y-3">
      {buildSteps(status).map(({ status: step, state }) => (
        <li key={step} className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cx(
              "flex size-6 shrink-0 items-center justify-center rounded-full",
              MARKER[state]
            )}
          >
            {state === "done" && <Check className="size-3.5" />}
            {state === "cancelled" && <X className="size-3.5" />}
          </span>
          <span className={cx("text-sm", state === "upcoming" ? "text-gray-500" : "font-medium text-ink")}>
            {ORDER_STATUS_LABELS[step] ?? step}
            <span className="sr-only"> ({STATE_TEXT[state]})</span>
          </span>
          {step === FIRST_STEP && createdAt && (
            <span className="text-xs text-gray-500">{formatDateTime(createdAt)}</span>
          )}
        </li>
      ))}
    </ol>
  );
}