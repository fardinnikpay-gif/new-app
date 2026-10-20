import { ImagePlus } from "lucide-react";
import { getCategoryImage, getCategoryLabel } from "../../utils/category";
import Thumb from "../common/Thumb";
import Button from "../ui/Button";

export default function CategoryCard({ category, onChangeImage }) {
  const label = getCategoryLabel(category);

  return (
    <li className="overflow-hidden rounded-lg bg-white shadow-card">
      <div className="aspect-video bg-gray-100">
        <Thumb src={getCategoryImage(category)} size="fill" />
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <h2 className="truncate text-base font-semibold text-ink">{label}</h2>
        <Button
          variant="outline"
          size="sm"
          aria-label={`Change image of ${label}`}
          onClick={() => onChangeImage(category)}
        >
          <ImagePlus className="size-4" aria-hidden="true" />
          Change image
        </Button>
      </div>
    </li>
  );
}