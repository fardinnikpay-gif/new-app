import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { deleteProduct } from "../api/productApi";

// Confirm-dialog state for deleting one product.
// `target` is kept after closing so the dialog text does not go blank while it animates out.
export default function useDeleteProduct(onDeleted) {
  const [target, setTarget] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const askDelete = useCallback((product) => {
    setTarget(product);
    setOpen(true);
  }, []);

  const cancel = useCallback(() => setOpen(false), []);

  const confirm = useCallback(async () => {
    if (!target || deleting) return;
    setDeleting(true);
    try {
      await deleteProduct(target._id);
      toast.success("Product deleted");
      setOpen(false);
      onDeleted();
    } catch (error) {
      // Dialog stays open so the admin can retry or cancel.
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  }, [target, deleting, onDeleted]);

  return { target, open, deleting, askDelete, cancel, confirm };
}