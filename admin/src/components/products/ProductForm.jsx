import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useProductImages from "../../hooks/useProductImages";
import useUnsavedChanges from "../../hooks/useUnsavedChanges";
import { CATEGORIES, CATEGORY_LABELS } from "../../utils/constants";
import { buildProductFormData, toFormValues } from "../../utils/productForm";
import { productSchema } from "../../validators/productSchema";
import Button from "../ui/Button";
import Checkbox from "../ui/Checkbox";
import ConfirmDialog from "../ui/ConfirmDialog";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import FormSection from "./FormSection";
import ImageUploader from "./ImageUploader";
import VariantsEditor from "./VariantsEditor";

const CATEGORY_OPTIONS = CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS[value] }));

// initialData: product from the API (edit) or undefined (create).
// onSubmit(formData) must call the API and throw on failure; its result goes to onSaved(result).
// submitting is owned by the page and stays true after success until it navigates away.
export default function ProductForm({ initialData, onSubmit, onSaved, submitting = false }) {
  const isEdit = Boolean(initialData);
  const defaultValues = useMemo(() => toFormValues(initialData), [initialData]);
  const images = useProductImages(initialData?.images);
  const [serverError, setServerError] = useState("");
  const errorRef = useRef(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({ resolver: zodResolver(productSchema), defaultValues });

  const { blocker, allowLeave } = useUnsavedChanges(isDirty || images.isDirty);
  const busy = submitting || isSubmitting;

  useEffect(() => {
    if (serverError) errorRef.current?.focus();
  }, [serverError]);

  const submit = async (values) => {
    if (busy) return;
    setServerError("");
    try {
      const formData = buildProductFormData(values, {
        files: images.files,
        removeImages: images.removedIds,
      });
      const saved = await onSubmit(formData);
      allowLeave();
      onSaved?.(saved);
    } catch (error) {
      setServerError(error.message);
    }
  };

  let submitLabel = isEdit ? "Save changes" : "Create product";
  if (busy && images.files.length > 0) submitLabel = "Uploading...";

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="mx-auto max-w-3xl space-y-6">
      {serverError && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg bg-danger-bg px-4 py-3 text-sm text-danger-fg outline-none"
        >
          {serverError}
        </div>
      )}

      <FormSection title="Basic information">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label="Title" error={errors.title?.message} {...register("title")} />
          </div>
          <Input label="Brand" error={errors.brand?.message} {...register("brand")} />
          <Select
            label="Category"
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
            error={errors.category?.message}
            {...register("category")}
          />
          {isEdit && (
            <div className="sm:col-span-2">
              <Input
                label="Slug"
                readOnly
                defaultValue={initialData.slug ?? ""}
                hint="Generated automatically and cannot be changed."
                className="bg-gray-50 text-gray-500"
              />
            </div>
          )}
          <div className="sm:col-span-2">
            <Textarea
              label="Description"
              rows={5}
              error={errors.description?.message}
              {...register("description")}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Pricing">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            error={errors.price?.message}
            {...register("price")}
          />
          <Input
            label="Discount price"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            hint="Leave empty for no discount."
            error={errors.discountPrice?.message}
            {...register("discountPrice")}
          />
        </div>
      </FormSection>

      <FormSection title="Images" description="The first image is the main one shown in the shop.">
        <ImageUploader
          existing={images.existing}
          files={images.files}
          onAdd={images.addFiles}
          onRemoveExisting={images.removeExisting}
          onRemoveNew={images.removeNew}
        />
      </FormSection>

      <FormSection title="Variants" description="Each size and color combination has its own stock.">
        <VariantsEditor control={control} />
      </FormSection>

      <FormSection title="Visibility">
        <div className="space-y-3">
          <Checkbox label="Active (visible in the shop)" {...register("isActive")} />
          <Checkbox label="Featured product" {...register("isFeatured")} />
        </div>
      </FormSection>

      <div className="sticky bottom-0 z-20 -mx-4 flex justify-end gap-3 border-t border-gray-200 bg-white px-4 py-3 sm:-mx-6 sm:px-6">
        <Button as={Link} to="/products" variant="outline">
          Cancel
        </Button>
        <Button type="submit" loading={busy}>
          {submitLabel}
        </Button>
      </div>

      <ConfirmDialog
        open={blocker.state === "blocked"}
        title="Discard changes?"
        message="You have unsaved changes. If you leave this page they will be lost."
        confirmLabel="Discard changes"
        tone="danger"
        onConfirm={() => blocker.proceed?.()}
        onClose={() => blocker.reset?.()}
      />
    </form>
  );
}