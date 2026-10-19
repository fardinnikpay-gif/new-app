import { X } from "lucide-react";

export default function OverlayHeader({ title, titleId, onClose }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
      <h2 id={titleId} className="text-lg font-semibold text-ink">
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-ink"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}