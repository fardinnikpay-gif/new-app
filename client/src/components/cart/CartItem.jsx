import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { getColorHex } from "../../utils/colors";
import { formatPrice } from "../../utils/format";
import { getItemImage, getLineAmounts, getMaxQty } from "../../utils/cart";
import Button from "../ui/Button";
import QuantityInput from "../ui/QuantityInput";
import { transitions } from "../../utils/motion";

const EXIT = { opacity: 0, x: -24 };
const TRANSITION = transitions.base

export default function CartItem({ item, line, issue, onQty, onRemove }) {
  const { unit, total } = getLineAmounts(line, item);
  const hex = getColorHex(item.color);
  const title = item.slug ? (
    <Link to={`/product/${item.slug}`} className="hover:underline">
      {item.title}
    </Link>
  ) : (
    item.title
  );

  return (
    <motion.li layout exit={EXIT} transition={TRANSITION} className="py-6">
      <div className="flex gap-4">
        <img
          src={getItemImage(item)}
          alt={item.title}
          width={112}
          height={140}
          loading="lazy"
          className="aspect-4/5 w-24 shrink-0 rounded-md bg-neutral-100 object-cover sm:w-28"
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-medium text-ink">{title}</h3>
              <p className="mt-1 flex items-center gap-2 text-sm capitalize text-neutral-600">
                {hex && (
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 rounded-full border border-neutral-300"
                    style={{ backgroundColor: hex }}
                  />
                )}
                {item.color} · {item.size}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-ink">{formatPrice(total)}</p>
              {item.qty > 1 && <p className="text-xs text-neutral-600">{formatPrice(unit)} each</p>}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-4">
            <QuantityInput
              value={item.qty}
              onChange={(qty) => onQty(item.key, qty)}
              min={1}
              max={getMaxQty(item, line)}
            />
            <button
              type="button"
              onClick={() => onRemove(item.key)}
              aria-label={`Remove ${item.title} from cart`}
              className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-ink"
            >
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {issue && (
        <div
          role="alert"
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700"
        >
          <p>{issue.message}</p>
          <div className="flex gap-2">
            {issue.type === "stock" && issue.available > 0 && (
              <Button size="sm" variant="outline" onClick={() => onQty(item.key, issue.available)}>
                Update to {issue.available}
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onRemove(item.key)}>
              Remove
            </Button>
          </div>
        </div>
      )}
    </motion.li>
  );
}