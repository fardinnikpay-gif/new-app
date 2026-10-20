import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { COUPON_LIMITS, COUPON_TYPES, COUPON_TYPE_LABELS } from "../../utils/constants";
import { buildCouponPayload, getTodayInputValue, toCouponFormValues } from "../../utils/coupon";
import { getCouponSchema } from "../../validators/couponSchema";
import Button from "../ui/Button";
import Checkbox from "../ui/Checkbox";
import Input from "../ui/Input";
import Select from "../ui/Select";

const TYPE_OPTIONS = COUPON_TYPES.map((value) => ({ value, label: COUPON_TYPE_LABELS[value] }));
const { codeMin, codeMax } = COUPON_LIMITS;

// initialData: coupon to edit, or undefined to create.
// takenCodes: uppercase codes of the other coupons.
// onSubmit(payload) calls the API and throws on failure (the message is shown in the form).
export default function CouponForm({ initialData, takenCodes = [], onSubmit, onCancel }) {
  const isEdit = Boolean(initialData);
  const schema = useMemo(() => getCouponSchema({ isEdit, takenCodes }), [isEdit, takenCodes]);
  const defaultValues = useMemo(() => toCouponFormValues(initialData), [initialData]);
  const [serverError, setServerError] = useState("");
  const errorRef = useRef(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues });
  const type = useWatch({ control, name: "type" });

  useEffect(() => {
    if (serverError) errorRef.current?.focus();
  }, [serverError]);

  const submit = async (values) => {
    setServerError("");
    try {
      await onSubmit(buildCouponPayload(values));
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      {serverError && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger-fg outline-none"
        >
          {serverError}
        </div>
      )}

      <Input
        label="Code"
        className="uppercase"
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        hint={`${codeMin}-${codeMax} characters: letters, numbers, - and _. Saved in uppercase.`}
        error={errors.code?.message}
        {...register("code")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Type"
          options={TYPE_OPTIONS}
          error={errors.type?.message}
          {...register("type")}
        />
        <Input
          label={type === "percent" ? "Discount (%)" : "Discount amount"}
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          error={errors.value?.message}
          {...register("value")}
        />
        <Input
          label="Minimum order"
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          hint="Leave empty for no minimum."
          error={errors.minOrder?.message}
          {...register("minOrder")}
        />
        <Input
          label="Max uses"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          hint="Total number of times it can be used."
          error={errors.maxUses?.message}
          {...register("maxUses")}
        />
        <Input
          label="Expires on"
          type="date"
          min={isEdit ? undefined : getTodayInputValue()}
          hint="Valid until the end of this day."
          error={errors.expiresAt?.message}
          {...register("expiresAt")}
        />
      </div>

      <Checkbox label="Active (customers can use it)" {...register("isActive")} />

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? "Save changes" : "Create coupon"}
        </Button>
      </div>
    </form>
  );
}