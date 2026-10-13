import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import Input from "../ui/Input";

const DEBOUNCE_MS = 500;
const digitsOnly = (value) => value.replace(/\D/g, "");

// Local state keeps typing smooth; the URL is updated after a short pause.
export default function PriceRangeFilter({ minPrice, maxPrice, onChange }) {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);
  const debouncedMin = useDebounce(min, DEBOUNCE_MS);
  const debouncedMax = useDebounce(max, DEBOUNCE_MS);

  // keep inputs in sync when the URL changes elsewhere (chips, "Clear all")
  useEffect(() => setMin(minPrice), [minPrice]);
  useEffect(() => setMax(maxPrice), [maxPrice]);

  useEffect(() => {
    if (debouncedMin !== minPrice || debouncedMax !== maxPrice) {
      onChange({ minPrice: debouncedMin, maxPrice: debouncedMax });
    }
    // only react to the user's debounced typing, not to prop changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin, debouncedMax]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <Input
        label="Min"
        inputMode="numeric"
        placeholder="0"
        value={min}
        onChange={(event) => setMin(digitsOnly(event.target.value))}
      />
      <Input
        label="Max"
        inputMode="numeric"
        placeholder="Any"
        value={max}
        onChange={(event) => setMax(digitsOnly(event.target.value))}
      />
    </div>
  );
}