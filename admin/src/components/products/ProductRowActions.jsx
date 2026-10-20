import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cx } from "../../utils/cx";

const ICON_BUTTON = "rounded-lg p-2.5 text-gray-500 transition-colors";

export default function ProductRowActions({ product, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        to={`/products/${product._id}/edit`}
        aria-label={`Edit ${product.title}`}
        className={cx(ICON_BUTTON, "hover:bg-gray-100 hover:text-ink")}
      >
        <Pencil className="size-4" aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={() => onDelete(product)}
        aria-label={`Delete ${product.title}`}
        className={cx(ICON_BUTTON, "hover:bg-danger-bg hover:text-danger-fg")}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}