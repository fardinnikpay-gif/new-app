import { useState } from "react";
import { CircleCheck } from "lucide-react";
import toast from "react-hot-toast";
import { sendCoupon } from "../../api/couponApi";
import useEmailList from "../../hooks/useEmailList";
import { MAX_COUPON_EMAILS } from "../../utils/constants";
import { formatDiscount, toSentCount } from "../../utils/coupon";
import Button from "../ui/Button";
import EmailInput from "./EmailInput";

const plural = (count) => (count === 1 ? "recipient" : "recipients");

export default function SendCouponForm({ coupon, onClose, onBusyChange }) {
  const list = useEmailList(MAX_COUPON_EMAILS);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null); // { sent, total } after success

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;

    // Include whatever is still typed in the box.
    const { emails, ok } = list.commit();
    if (!ok) return;
    if (emails.length === 0) {
      setSubmitError("Add at least one email address.");
      return;
    }

    setSending(true);
    onBusyChange(true);
    setSubmitError("");
    try {
      const sent = toSentCount(await sendCoupon(coupon._id, emails), emails.length);
      setResult({ sent, total: emails.length });
      toast.success(`Coupon sent to ${sent} ${plural(sent)}`);
    } catch (error) {
      setSubmitError(error.message); // the list stays, so the admin can retry
    } finally {
      setSending(false);
      onBusyChange(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-4 text-center">
        <CircleCheck className="mx-auto size-10 text-success-fg" aria-hidden="true" />
        <p role="status" className="text-base font-medium text-ink">
          Sent to {result.sent} of {result.total} {plural(result.total)}
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <p className="text-sm text-gray-600">
        Email the code <span className="font-mono font-semibold text-ink">{coupon.code}</span> (
        {formatDiscount(coupon)} off) to your customers.
      </p>

      <EmailInput
        emails={list.emails}
        text={list.text}
        error={list.error}
        max={MAX_COUPON_EMAILS}
        disabled={sending}
        onTextChange={list.setText}
        onCommit={list.commit}
        onRemove={list.remove}
      />

      {submitError && (
        <div role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger-fg">
          {submitError}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={sending}>
          Cancel
        </Button>
        <Button type="submit" loading={sending}>
          Send
        </Button>
      </div>
    </form>
  );
}