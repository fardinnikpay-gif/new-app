import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { addAddress, deleteAddress, updateAddress } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { MAX_SAVED_ADDRESSES } from "../../data/checkoutContent";
import { toShippingAddress } from "../../data/address";
import { normalizePhone } from "../../utils/identifier";
import Seo from "../../components/common/Seo";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AccountSection from "../../components/account/AccountSection";
import AddressCard from "../../components/account/AddressCard";
import AddressForm from "../../components/account/AddressForm";
import FormError from "../../components/account/FormError";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";

export default function Addresses() {
  const { user, refreshUser } = useAuth();
  const [addresses, setAddresses] = useState(user.addresses ?? []);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // address being edited; null = adding
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const sorted = useMemo(
    () => [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [addresses]
  );
  const canAdd = addresses.length < MAX_SAVED_ADDRESSES;

  // the API response is the source of truth; refreshUser keeps checkout/user data in sync
  const applyList = (list) => {
    setAddresses(list);
    Promise.resolve(refreshUser()).catch(() => {});
  };

  const openForm = (address = null) => {
    setEditing(address);
    setFormError("");
    setFormOpen(true);
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    setFormError("");
    const body = {
      ...toShippingAddress({ ...values, phone: normalizePhone(values.phone) }),
      isDefault: Boolean(values.isDefault) || addresses.length === 0,
    };
    try {
      const { addresses: next } = editing
        ? await updateAddress(editing._id, body)
        : await addAddress(body);
      applyList(next);
      setFormOpen(false);
      toast.success(editing ? "Address updated" : "Address added");
    } catch (error) {
      setFormError(error.message || "Could not save this address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { addresses: next } = await deleteAddress(toDelete._id);
      applyList(next);
      toast.success("Address deleted");
    } catch (error) {
      toast.error(error.message || "Could not delete this address.");
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <>
      <Seo title="Addresses" description="Manage your saved addresses." />
      <AccountSection
        title="Addresses"
        description={`Save up to ${MAX_SAVED_ADDRESSES} addresses for faster checkout.`}
        narrow={false}
      >
        {sorted.length === 0 ? (
          <div className="flex flex-col items-start gap-4">
            <EmptyState title="No saved addresses" />
            <Button onClick={() => openForm()}>Add address</Button>
          </div>
        ) : (
          <>
            <ul className="grid gap-4 md:grid-cols-2">
              {sorted.map((address) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  disabled={deleting}
                  onEdit={openForm}
                  onDelete={setToDelete}
                />
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button onClick={() => openForm()} disabled={!canAdd}>
                Add address
              </Button>
              {!canAdd && (
                <p className="text-sm text-neutral-600">
                  You've reached the limit of {MAX_SAVED_ADDRESSES} addresses.
                </p>
              )}
            </div>
          </>
        )}
      </AccountSection>

      <Modal
        open={formOpen}
        onClose={saving ? () => {} : () => setFormOpen(false)}
        title={editing ? "Edit address" : "Add address"}
      >
        <div className="space-y-4">
          <FormError message={formError} />
          <AddressForm
            key={editing?._id ?? "new"}
            defaultValues={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
            submitLabel={editing ? "Save changes" : "Add address"}
            showDefaultOption
            submitting={saving}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this address?"
        message="This address will be removed from your account."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
        loading={deleting}
      />
    </>
  );
}