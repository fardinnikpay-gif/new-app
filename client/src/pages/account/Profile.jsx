import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { updateProfile } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { normalizePhone } from "../../utils/identifier";
import { makeProfileSchema } from "../../utils/validators";
import Seo from "../../components/common/Seo";
import AccountSection from "../../components/account/AccountSection";
import FormError from "../../components/account/FormError";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [serverError, setServerError] = useState("");
  const schema = useMemo(() => makeProfileSchema(!user.email), [user.email]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name ?? "", phone: user.phone ?? "" },
  });

  const onSubmit = async (values) => {
    setServerError("");
    const payload = { name: values.name.trim(), phone: normalizePhone(values.phone) };
    try {
      await updateProfile(payload);
      await refreshUser(); // keeps the header/user menu in sync
      reset(payload); // the saved values become the new baseline
      toast.success("Profile updated");
    } catch (error) {
      setServerError(error.message || "Could not update your profile. Please try again.");
    }
  };

  return (
    <>
      <Seo title="Profile" description="Manage your profile details." />
      <AccountSection title="Profile" description="Update your name and phone number.">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Input
            label="Full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <div>
            <Input
              label="Email"
              type="email"
              readOnly
              value={user.email ?? ""}
              placeholder="Not provided"
            />
            <p className="mt-1 text-sm text-neutral-600">Your email can't be changed here.</p>
          </div>
          <Input
            label="Phone"
            type="tel"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <FormError message={serverError} />
          <Button type="submit" size="lg" loading={isSubmitting} disabled={!isDirty}>
            Save changes
          </Button>
        </form>
      </AccountSection>
    </>
  );
}