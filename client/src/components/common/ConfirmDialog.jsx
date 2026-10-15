import Button from "../ui/Button";
import Modal from "../ui/Modal";

// Explicit confirmation for destructive actions (delete address, cancel order).
export default function ConfirmDialog({
  open, title, message, confirmLabel = "Confirm", cancelLabel = "Keep it", onConfirm, onClose, loading,
}) {
  return (
    <Modal open={open} onClose={loading ? () => {} : onClose} title={title}>
      <p className="text-neutral-600">{message}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}