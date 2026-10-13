import { SORT_OPTIONS } from "../../data/shopFilters";
import Select from "../ui/Select";

export default function SortSelect({ value, onChange }) {
  return (
    <div className="w-52">
      <Select label="Sort by" value={value} onChange={(event) => onChange(event.target.value)}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}