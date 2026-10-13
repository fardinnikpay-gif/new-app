import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "../../utils/validators";
import Button from "../ui/Button";
import Input from "../ui/Input";

const EMPTY = { fullName: "", phone: "", city: "", street: "", postalCode: "", saveToAccount: false };

// Reusable address form (checkout now, account addresses in step 20).
export default function AddressForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save address",
  showSaveOption = false,
  submitting = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  });
  const busy = isSubmitting || submitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full name"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Phone"
          type="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>
      <Input
        label="Street address"
        autoComplete="street-address"
        error={errors.street?.message}
        {...register("street")}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="City"
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="Postal code"
          autoComplete="postal-code"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
      </div>

      {showSaveOption && (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink">
          <input type="checkbox" className="h-5 w-5 accent-primary" {...register("saveToAccount")} />
          Save this address to my account
        </label>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={busy}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}