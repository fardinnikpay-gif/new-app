import { useState } from "react";
import Modal from "../ui/Modal";
import SendCouponForm from "./SendCouponForm";

// The form mounts only while the modal is open, so its state resets on every open.
// Closing is blocked while the request is running.
export default function SendCouponModal({ coupon, open, onClose }) {
  const [busy, setBusy] = useState(false);

  const handleClose = () => {
    if (!busy) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={coupon ? `Send ${coupon.code} by email` : "Send coupon"}
    >
      {coupon && (
        <SendCouponForm coupon={coupon} onClose={handleClose} onBusyChange={setBusy} />
      )}
    </Modal>
  );
}