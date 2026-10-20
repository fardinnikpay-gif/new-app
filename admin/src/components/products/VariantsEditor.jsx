import { Plus } from "lucide-react";
import { useFieldArray, useFormState, useWatch } from "react-hook-form";
import { COLOR_SUGGESTIONS, SIZE_SUGGESTIONS } from "../../utils/constants";
import { formatNumber } from "../../utils/format";
import { createEmptyVariant } from "../../utils/productForm";
import Button from "../ui/Button";
import VariantRow from "./VariantRow";

const SIZE_LIST_ID = "variant-size-options";
const COLOR_LIST_ID = "variant-color-options";

// Counts only valid whole-number stock values (so half-typed input never breaks the total).
const sumStock = (variants = []) =>
  variants.reduce((sum, variant) => {
    const stock = Number(variant?.stock);
    return Number.isInteger(stock) && stock > 0 ? sum + stock : sum;
  }, 0);

export default function VariantsEditor({ control }) {
  const { fields, append, remove } = useFieldArray({ control, name: "variants" });
  const { errors } = useFormState({ control });
  const variants = useWatch({ control, name: "variants" });

  // Array-level errors (e.g. "Add at least one variant") may live under .root or directly on the array.
  const rootError = errors.variants?.root?.message ?? errors.variants?.message;

  return (
    <div>
      <datalist id={SIZE_LIST_ID}>
        {SIZE_SUGGESTIONS.map((size) => (
          <option key={size} value={size} />
        ))}
      </datalist>
      <datalist id={COLOR_LIST_ID}>
        {COLOR_SUGGESTIONS.map((color) => (
          <option key={color} value={color} />
        ))}
      </datalist>

      <div
        aria-hidden="true"
        className="mb-2 hidden grid-cols-12 gap-3 text-xs font-medium uppercase tracking-wide text-gray-500 md:grid"
      >
        <span className="col-span-4">Size</span>
        <span className="col-span-4">Color</span>
        <span className="col-span-3">Stock</span>
      </div>

      <ul className="space-y-3">
        {fields.map((field, index) => (
          <VariantRow
            key={field.id}
            control={control}
            index={index}
            canRemove={fields.length > 1}
            onRemove={() => remove(index)}
            sizeListId={SIZE_LIST_ID}
            colorListId={COLOR_LIST_ID}
          />
        ))}
      </ul>

      {rootError && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {rootError}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={() => append(createEmptyVariant())}>
          <Plus className="size-4" aria-hidden="true" />
          Add variant
        </Button>
        <p className="text-sm text-gray-600">
          Total stock:{" "}
          <span className="font-semibold text-ink">{formatNumber(sumStock(variants))}</span>
        </p>
      </div>
    </div>
  );
}