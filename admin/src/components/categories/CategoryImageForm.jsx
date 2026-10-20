import { useState } from "react";
import { updateCategory } from "../../api/categoryApi";
import { getCategoryImage, getCategoryLabel } from "../../utils/category";
import Thumb from "../common/Thumb";
import ImageUploader from "../products/ImageUploader";
import Button from "../ui/Button";

const SINGLE_IMAGE = 1;

// Picks one image and uploads it as the "image" field. onSaved receives the updated category.
export default function CategoryImageForm({ category, onSaved, onCancel, onBusyChange }) {
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const label = getCategoryLabel(category);

  const handleSave = async () => {
    if (!file || saving) return;
    setSaving(true);
    onBusyChange(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const updated = await updateCategory(category._id, formData);
      onSaved(updated);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
      onBusyChange(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Thumb src={getCategoryImage(category)} size="lg" alt={`Current ${label} image`} />
        <p className="text-sm text-gray-600">
          Current image of <span className="font-medium text-ink">{label}</span>. Remove the
          selected file (✕) to pick a different one.
        </p>
      </div>

      <ImageUploader
        files={file ? [file] : []}
        onAdd={(added) => setFile(added[0])}
        onRemoveNew={() => setFile(null)}
        max={SINGLE_IMAGE}
        showMain={false}
      />

      {error && (
        <div role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger-fg">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} loading={saving} disabled={!file}>
          {saving ? "Uploading..." : "Upload image"}
        </Button>
      </div>
    </div>
  );
}