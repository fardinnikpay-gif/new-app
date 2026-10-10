import { Inbox } from "lucide-react";
import { cx } from "../../utils/cx";

// props: { title, description, action (node), icon (lucide component), className }
export default function EmptyState({ title, description, action, icon: Icon = Inbox, className }) {
  return (
    <div className={cx("flex flex-col items-center gap-3 px-4 py-16 text-center", className)}>
      <Icon aria-hidden="true" className="h-10 w-10 text-neutral-400" />
      <h2 className="text-xl">{title}</h2>
      {description && <p className="max-w-sm text-neutral-500">{description}</p>}
      {action}
    </div>
  );
}