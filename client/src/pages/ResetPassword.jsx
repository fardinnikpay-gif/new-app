import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { resetPassword } from "../api/authApi";
import { useAuth } from "../context/useAuth";
import { resetSchema } from "../utils/validators";
import Seo from "../components/common/Seo";
import AuthLayout from "../components/account/AuthLayout";
import FormError from "../components/account/FormError";
import PasswordInput from "../components/account/PasswordInput";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const TOKEN_ERROR_STATUSES = [400, 401, 404, 410];
const TOKEN_ERROR_PATTERN = /token|expired|invalid/i;

const isTokenError = (error) =>
  TOKEN_ERROR_STATUSES.includes(error.status) && TOKEN_ERROR_PATTERN.test(error.message ?? "");

export default function ResetPassword() {
  const { token } = useParams();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async ({ password }) => {
    setServerError("");
    try {
      await resetPassword(token, password);
    } catch (error) {
      if (isTokenError(error)) setTokenInvalid(true);
      else setServerError(error.message || "Could not reset your password. Please try again.");
      return;
    }

    toast.success("Password updated");
    try {
      await refreshUser(); // the reset response signs the user in
      navigate("/account", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <Seo title="Reset password" description="Choose a new password." />
      <AuthLayout
        title="Choose a new password"
        subtitle="Use at least 8 characters."
        footer={
          <Link to="/login" className="font-medium text-ink underline-offset-4 hover:underline">
            ← Back to log in
          </Link>
        }
      >
        {tokenInvalid ? (
          <div role="alert" className="space-y-4">
            <p className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              This reset link is invalid or has expired.
            </p>
            <Button as={Link} to="/forgot-password" size="lg" className="w-full">
              Request a new link
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <PasswordInput
              label="New password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Input
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <FormError message={serverError} />
            <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
              Update password
            </Button>
          </form>
        )}
      </AuthLayout>
    </>
  );
}