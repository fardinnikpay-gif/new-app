import { Link } from "react-router-dom";
import Modal from "../ui/Modal";
import SizeChart from "./SizeChart";

export default function SizeGuideModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Size guide">
      <div data-lenis-prevent className="max-h-[70svh] overflow-y-auto">
        <SizeChart />
        <Link
          to="/size-guide"
          onClick={onClose}
          className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          How to measure →
        </Link>
      </div>
    </Modal>
  );
}