
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { staggerDelay } from "../../utils/motion";
import Reveal from "../motion/Reveal";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  disabled,
  index = 0,
}) {
  return (
    <Reveal
      as="li"
      delay={staggerDelay(index)}
      className="flex flex-col justify-between rounded-lg border border-neutral-200 p-5"
    >
      <div className="text-sm">
        <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
          {address.fullName}
          {address.isDefault && <Badge tone="neutral">Default</Badge>}
        </p>

        <p className="mt-2 text-neutral-600">{address.street}</p>

        <p className="text-neutral-600">
          {address.city}, {address.postalCode}
        </p>

        <p className="text-neutral-600">{address.phone}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(address)}
          disabled={disabled}
        >
          Edit
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(address)}
          disabled={disabled}
        >
          Delete
        </Button>
      </div>
    </Reveal>
  );
}