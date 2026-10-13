import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { parseIdentifier } from "../utils/identifier";
import { getRedirectPath } from "../utils/redirect";
import { loginSchema } from "../utils/validators";
import Seo from "../components/common/Seo";
import AuthLayout from "../components/account/AuthLayout";
import FormError from "../components/account/FormError";
import PasswordInput from "../components/account/PasswordInput";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const { email, phone } = parseIdentifier(values.identifier);
      await login(email ?? phone, values.password);
      navigate(getRedirectPath(location.state), { replace: true });
    } catch (error) {
      setServerError(error.message || "Could not sign in. Please try again.");
    }
  };

  return (
    <>
      <Seo title="Log in" description="Log in to your account." />
      <AuthLayout
        title="Welcome back"
        subtitle="Log in to your account to continue."
        footer={
          <>
            New here?{" "}
            <Link
              to="/register"
              state={location.state}
              className="font-medium text-ink underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Input
            label="Email or phone"
            autoComplete="username"
            error={errors.identifier?.message}
            {...register("identifier")}
          />
          <PasswordInput
            label="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="inline-flex min-h-11 items-center text-sm text-neutral-600 underline-offset-4 hover:text-ink hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <FormError message={serverError} />
          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Log in
          </Button>
        </form>
      </AuthLayout>
    </>
  );
}