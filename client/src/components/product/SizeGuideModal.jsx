import { Link } from "react-router-dom";
import Modal from "../ui/Modal";

// Placeholder: step 22 replaces the body with the real size tables.
export default function SizeGuideModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Size guide">
      <p className="text-neutral-600">
        Sizes are a guide and may vary slightly between styles. See the full measurement tables on the
        size guide page.
      </p>
      <Link
        to="/size-guide"
        onClick={onClose}
        className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        View full size guide
      </Link>
    </Modal>
  );
}