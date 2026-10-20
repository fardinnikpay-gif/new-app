import Switch from "../ui/Switch";

// The text next to the switch means the state is not conveyed by position/color alone.
export default function ProductActiveSwitch({ product, pending = false, onToggle }) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={Boolean(product.isActive)}
        onChange={() => onToggle(product)}
        disabled={pending}
        label={`Active status of ${product.title}`}
      />
      <span className="text-xs text-gray-500">{product.isActive ? "Active" : "Inactive"}</span>
    </div>
  );
}