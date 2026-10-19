import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", message, icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <Icon className="size-10 text-gray-400" aria-hidden="true" />
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {message && <p className="max-w-sm text-sm text-gray-500">{message}</p>}
      {action}
    </div>
  );
}