import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "../api/authApi";
import { forgotSchema } from "../utils/validators";
import Seo from "../components/common/Seo";
import AuthLayout from "../components/account/AuthLayout";
import FormError from "../components/account/FormError";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const SUCCESS_MESSAGE =
  "If an account exists for that email, we've sent a link to reset your password. Check your inbox and spam folder.";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotSchema), defaultValues: { email: "" } });

  const onSubmit = async ({ email }) => {
    setServerError("");
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (error) {
      // Any HTTP response shows the same message so we never reveal whether an account exists.
      // Only a missing response (network down) is reported, because no email was sent.
      if (error.status) setSent(true);
      else setServerError("We couldn't reach the server. Please check your connection and try again.");
    }
  };

  return (
    <>
      <Seo title="Forgot password" description="Reset your password." />
      <AuthLayout
        title="Forgot your password?"
        subtitle="Enter your email and we'll send you a reset link."
        footer={
          <Link to="/login" className="font-medium text-ink underline-offset-4 hover:underline">
            ← Back to log in
          </Link>
        }
      >
        {sent ? (
          <p role="status" className="rounded-md bg-neutral-100 p-4 text-sm text-ink">
            {SUCCESS_MESSAGE}
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <FormError message={serverError} />
            <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
              Send reset link
            </Button>
          </form>
        )}
      </AuthLayout>
    </>
  );
}