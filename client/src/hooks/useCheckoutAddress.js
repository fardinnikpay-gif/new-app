import { useCallback, useMemo, useState } from "react";
import { addAddress } from "../api/userApi";
import { useAuth } from "../context/useAuth";
import { MAX_SAVED_ADDRESSES, NEW_ADDRESS_ID } from "../data/checkoutContent";
import { sameAddress, toShippingAddress } from "../data/address";
import { normalizePhone } from "../utils/identifier";

const getDefaultId = (saved) => (saved.find((a) => a.isDefault) ?? saved[0])?._id ?? null;

// Which shipping address the order will use: a saved one (default pre-selected) or one typed here.
export default function useCheckoutAddress() {
  const { user, refreshUser } = useAuth();
  const saved = useMemo(() => user?.addresses ?? [], [user]);

  const [selectedId, setSelectedId] = useState(() => getDefaultId(saved));
  const [custom, setCustom] = useState(null);
  const [formOpen, setFormOpen] = useState(saved.length === 0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const selected = selectedId === NEW_ADDRESS_ID ? custom : saved.find((a) => a._id === selectedId);
  // while the form is open nothing is "chosen" yet, so an order can't be placed by accident
  const shippingAddress = formOpen ? null : toShippingAddress(selected);

  const selectSaved = useCallback((id) => {
    setSelectedId(id);
    setFormOpen(false);
  }, []);
  const selectCustom = useCallback(() => setSelectedId(NEW_ADDRESS_ID), []);
  const openForm = useCallback(() => setFormOpen(true), []);
  const cancelForm = useCallback(() => setFormOpen(false), []);

  const submitForm = useCallback(
    async (values) => {
      const fields = toShippingAddress({ ...values, phone: normalizePhone(values.phone) });
      setSaveError("");

      if (values.saveToAccount && saved.length < MAX_SAVED_ADDRESSES) {
        setSaving(true);
        try {
          const { addresses } = await addAddress({ ...fields, isDefault: saved.length === 0 });
          await refreshUser();
          const match = [...addresses].reverse().find((a) => sameAddress(a, fields));
          if (match) {
            setSelectedId(match._id);
            setCustom(null);
            setFormOpen(false);
            return;
          }
        } catch {
          setSaveError(
            "We couldn't save this address to your account, but you can still use it for this order."
          );
        } finally {
          setSaving(false);
        }
      }

      setCustom(fields);
      setSelectedId(NEW_ADDRESS_ID);
      setFormOpen(false);
    },
    [refreshUser, saved.length]
  );

  return {
    saved, selectedId, custom, formOpen, saving, saveError,
    canSave: saved.length < MAX_SAVED_ADDRESSES,
    canCancel: Boolean(selected),
    shippingAddress,
    selectSaved, selectCustom, openForm, cancelForm, submitForm,
  };
}