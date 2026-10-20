import { Trash2 } from "lucide-react";
import { useFormState, useWatch } from "react-hook-form";
import { getColorHex } from "../../utils/colors";
import Input from "../ui/Input";

function ColorDot({ color }) {
  return (
    <span
      aria-hidden="true"
      className="block size-4 rounded-full border border-gray-300"
      style={{ backgroundColor: getColorHex(color) ?? "transparent" }}
    />
  );
}

// One size/color/stock row. Below md it is a card with visible labels;
// from md up it is a table-like row (the labels move to the header in VariantsEditor).
export default function VariantRow({
  control,
  index,
  canRemove,
  onRemove,
  sizeListId,
  colorListId,
}) {
  const { register } = control; // control.register keeps the component API at { control }
  const { errors } = useFormState({ control });
  const color = useWatch({ control, name: `variants.${index}.color` });
  const rowErrors = errors.variants?.[index];
  const number = index + 1;

  return (
    <li className="grid gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-12 md:items-start md:border-0 md:p-0 md:[&_label]:sr-only">
      <div className="md:col-span-4">
        <Input
          label="Size"
          aria-label={`Size, variant ${number}`}
          placeholder="e.g. M"
          list={sizeListId}
          autoComplete="off"
          error={rowErrors?.size?.message}
          {...register(`variants.${index}.size`)}
        />
      </div>
      <div className="md:col-span-4">
        <Input
          label="Color"
          aria-label={`Color, variant ${number}`}
          placeholder="e.g. navy"
          list={colorListId}
          autoComplete="off"
          endAdornment={<ColorDot color={color} />}
          error={rowErrors?.color?.message}
          {...register(`variants.${index}.color`)}
        />
      </div>
      <div className="md:col-span-3">
        <Input
          label="Stock"
          aria-label={`Stock, variant ${number}`}
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          error={rowErrors?.stock?.message}
          {...register(`variants.${index}.stock`)}
        />
      </div>
      <div className="flex justify-end md:col-span-1">
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Remove variant ${number}`}
          className="rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-danger-bg hover:text-danger-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}