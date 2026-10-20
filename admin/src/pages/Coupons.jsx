import { useMemo, useState } from "react";
import { Plus, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from "../api/couponApi";
import PageHeader from "../components/common/PageHeader";
import CouponForm from "../components/coupons/CouponForm";
import CouponsTable from "../components/coupons/CouponsTable";
import SendCouponModal from "../components/coupons/SendCouponModal";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Modal from "../components/ui/Modal";
import useAsync from "../hooks/useAsync";
import useConfirmDelete from "../hooks/useConfirmDelete";

const NO_COUPONS = [];

export default function Coupons() {
  const { data, loading, error, reload } = useAsync(getCoupons, []);
  const coupons = data ?? NO_COUPONS;
  // `coupon` is kept after closing so the modal title does not flip during its exit animation.
  const [form, setForm] = useState({ open: false, coupon: null });
  const [send, setSend] = useState({ open: false, coupon: null });

  const deletion = useConfirmDelete(deleteCoupon, {
    successMessage: "Coupon deleted",
    onDeleted: reload,
  });

  // Codes of the OTHER coupons, for the form's quick duplicate check.
  const takenCodes = useMemo(
    () =>
      coupons
        .filter((coupon) => coupon._id !== form.coupon?._id)
        .map((coupon) => String(coupon.code).toUpperCase()),
    [coupons, form.coupon]
  );

  const openCreate = () => setForm({ open: true, coupon: null });
  const openEdit = (coupon) => setForm({ open: true, coupon });
  const closeForm = () => setForm((prev) => ({ ...prev, open: false }));
  const openSend = (coupon) => setSend({ open: true, coupon });
  const closeSend = () => setSend((prev) => ({ ...prev, open: false }));

  const handleSave = async (payload) => {
    const editing = form.coupon;
    if (editing) await updateCoupon(editing._id, payload);
    else await createCoupon(payload);
    toast.success(editing ? "Coupon updated" : "Coupon created");
    closeForm();
    reload();
  };

  const emptyState = (
    <EmptyState
      icon={Ticket}
      title="No coupons yet"
      message="Create a discount code to share with your customers."
      action={<Button onClick={openCreate}>Create coupon</Button>}
    />
  );

  return (
    <>
      <PageHeader
        title="Coupons"
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" aria-hidden="true" />
            Add coupon
          </Button>
        }
      />

      {error ? (
        <ErrorState title="Could not load coupons" message={error.message} onRetry={reload} />
      ) : (
        <CouponsTable
          coupons={coupons}
          loading={loading}
          onEdit={openEdit}
          onSend={openSend}
          onDelete={deletion.askDelete}
          emptyState={emptyState}
        />
      )}

      <Modal
        open={form.open}
        onClose={closeForm}
        title={form.coupon ? "Edit coupon" : "New coupon"}
      >
        <CouponForm
          key={form.coupon?._id ?? "new"}
          initialData={form.coupon ?? undefined}
          takenCodes={takenCodes}
          onSubmit={handleSave}
          onCancel={closeForm}
        />
      </Modal>

      <SendCouponModal coupon={send.coupon} open={send.open} onClose={closeSend} />

      <ConfirmDialog
        open={deletion.open}
        title="Delete coupon?"
        message={`Coupon "${deletion.target?.code ?? ""}" will be permanently deleted and customers can no longer use it. This action cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={deletion.confirm}
        onClose={deletion.cancel}
        loading={deletion.deleting}
      />
    </>
  );
}