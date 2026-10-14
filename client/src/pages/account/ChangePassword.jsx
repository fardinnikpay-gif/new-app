import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { changePassword } from "../../api/userApi";
import { changePasswordSchema } from "../../utils/validators";
import Seo from "../../components/common/Seo";
import AccountSection from "../../components/account/AccountSection";
import FormError from "../../components/account/FormError";
import PasswordInput from "../../components/account/PasswordInput";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const WRONG_PASSWORD_STATUSES = [400, 403];
const WRONG_PASSWORD_PATTERN = /current|incorrect|wrong|does not match/i;

const isWrongCurrentPassword = (error) =>
  WRONG_PASSWORD_STATUSES.includes(error.status) && WRONG_PASSWORD_PATTERN.test(error.message ?? "");

export default function ChangePassword() {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async ({ currentPassword, newPassword }) => {
    setServerError("");
    try {
      await changePassword({ currentPassword, newPassword });
      reset();
      toast.success("Password updated");
    } catch (error) {
      if (isWrongCurrentPassword(error)) {
        setError(
          "currentPassword",
          { type: "server", message: "Your current password is incorrect." },
          { shouldFocus: true }
        );
      } else {
        setServerError(error.message || "Could not update your password. Please try again.");
      }
    }
  };

  return (
    <>
      <Seo title="Change password" description="Update your account password." />
      <AccountSection title="Change password" description="Use at least 8 characters.">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <PasswordInput
            label="Current password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <FormError message={serverError} />
          <Button type="submit" size="lg" loading={isSubmitting}>
            Update password
          </Button>
        </form>
      </AccountSection>
    </>
  );
}