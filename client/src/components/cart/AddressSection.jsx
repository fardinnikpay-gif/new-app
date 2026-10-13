import { useId } from "react";
import { NEW_ADDRESS_ID } from "../../data/checkoutContent";
import AddressForm from "../account/AddressForm";
import FormError from "../account/FormError";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import SelectableCard from "./SelectableCard";

function AddressSummary({ address, showDefault }) {
  return (
    <div className="text-sm">
      <p className="font-medium text-ink">
        {address.fullName}
        {showDefault && address.isDefault && (
          <Badge tone="neutral" className="ml-2">
            Default
          </Badge>
        )}
      </p>
      <p className="mt-1 text-neutral-600">{address.street}</p>
      <p className="text-neutral-600">
        {address.city}, {address.postalCode}
      </p>
      <p className="text-neutral-600">{address.phone}</p>
    </div>
  );
}

// Receives the state/actions from useCheckoutAddress().
export default function AddressSection({
  saved, selectedId, custom, formOpen, saving, saveError,
  canSave, canCancel, selectSaved, selectCustom, openForm, cancelForm, submitForm,
}) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-medium text-ink">
        Shipping address
      </h2>

      {formOpen ? (
        <div className="mt-6">
          <AddressForm
            defaultValues={custom ?? undefined}
            onSubmit={submitForm}
            onCancel={canCancel ? cancelForm : undefined}
            submitLabel="Use this address"
            showSaveOption={canSave}
            submitting={saving}
          />
        </div>
      ) : (
        <div role="radiogroup" aria-labelledby={headingId} className="mt-6 space-y-3">
          {saved.map((address) => (
            <SelectableCard
              key={address._id}
              name="address"
              value={address._id}
              checked={selectedId === address._id}
              onChange={() => selectSaved(address._id)}
            >
              <AddressSummary address={address} showDefault />
            </SelectableCard>
          ))}
          {custom && (
            <SelectableCard
              name="address"
              value={NEW_ADDRESS_ID}
              checked={selectedId === NEW_ADDRESS_ID}
              onChange={selectCustom}
            >
              <AddressSummary address={custom} />
            </SelectableCard>
          )}
          <Button variant="outline" onClick={openForm}>
            {custom ? "Edit this address" : "Use a different address"}
          </Button>
          <FormError message={saveError} />
        </div>
      )}
    </section>
  );
}