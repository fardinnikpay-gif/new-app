import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation } from "react-router-dom";
import FullPageSpinner from "../components/common/FullPageSpinner";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import useAuth from "../hooks/useAuth";
import { loginSchema } from "../validators/loginSchema";

const SITE_NAME = import.meta.env.VITE_SITE_NAME || "Store";
const DEFAULT_REDIRECT = "/dashboard";

export default function Login() {
  const { admin, loading, login } = useAuth();
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

  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search}` : DEFAULT_REDIRECT;

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await login(values.identifier, values.password);
    } catch (error) {
      setServerError(error.message);
    }
  };

  if (loading) return <FullPageSpinner />;
  if (admin) return <Navigate to={redirectTo} replace />;

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-card sm:p-8">
        <h1 className="text-2xl font-bold text-ink">{SITE_NAME}</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to the admin panel</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          {serverError && (
            <div role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger-fg">
              {serverError}
            </div>
          )}
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
          <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}