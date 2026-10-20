import { useCallback, useState } from "react";
import toast from "react-hot-toast";

// Confirm-dialog state for deleting one item: deleteFn(id) -> Promise.
// `target` is kept after closing so the dialog text does not go blank while it animates out.
export default function useConfirmDelete(deleteFn, { successMessage, onDeleted }) {
  const [target, setTarget] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const askDelete = useCallback((item) => {
    setTarget(item);
    setOpen(true);
  }, []);

  const cancel = useCallback(() => setOpen(false), []);

  const confirm = useCallback(async () => {
    if (!target || deleting) return;
    setDeleting(true);
    try {
      await deleteFn(target._id);
      toast.success(successMessage);
      setOpen(false);
      onDeleted();
    } catch (error) {
      // Dialog stays open so the admin can retry or cancel.
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  }, [target, deleting, deleteFn, successMessage, onDeleted]);

  return { target, open, deleting, askDelete, cancel, confirm };
}