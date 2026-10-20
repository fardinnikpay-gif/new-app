import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import useDebounce from "../../hooks/useDebounce";
import { cx } from "../../utils/cx";
import { fieldClass } from "../ui/fieldUtils";

// Debounced. `value` is the committed query (usually from the URL).
// emittedRef = last value known to both sides, so typing is never overwritten
// by our own echo coming back through `value`.
export default function SearchInput({
  value = "",
  onChange,
  placeholder = "Search...",
  label = "Search",
  className,
}) {
  const [text, setText] = useState(value);
  const query = useDebounce(text).trim();
  const emittedRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  // External change (e.g. browser Back): adopt it without echoing it back.
  useEffect(() => {
    if (value !== emittedRef.current) {
      emittedRef.current = value;
      setText(value);
    }
  }, [value]);

  useEffect(() => {
    if (query !== emittedRef.current) {
      emittedRef.current = query;
      onChangeRef.current(query);
    }
  }, [query]);

  const handleClear = () => {
    setText("");
    if (emittedRef.current !== "") {
      emittedRef.current = "";
      onChange("");
    }
  };

  return (
    <div className={cx("relative w-full sm:max-w-xs", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
      <input
        type="text"
        role="searchbox"
        inputMode="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className={cx(fieldClass(false), "pl-9 pr-9")}
      />
      {text && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-ink"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}