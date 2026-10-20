import { useState } from "react";
import { getCategoryLabel } from "../../utils/category";
import Modal from "../ui/Modal";
import CategoryImageForm from "./CategoryImageForm";

// The form mounts only while the modal is open, so its state resets on every open.
// Closing is blocked while an upload is running.
export default function CategoryImageModal({ category, open, onClose, onSaved }) {
  const [busy, setBusy] = useState(false);

  const handleClose = () => {
    if (!busy) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={category ? `Change ${getCategoryLabel(category)} image` : "Change image"}
    >
      {category && (
        <CategoryImageForm
          category={category}
          onSaved={onSaved}
          onCancel={handleClose}
          onBusyChange={setBusy}
        />
      )}
    </Modal>
  );
}