import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/useAuth";
import { parseIdentifier } from "../utils/identifier";
import { getRedirectPath } from "../utils/redirect";
import { registerSchema } from "../utils/validators";
import Seo from "../components/common/Seo";
import AuthLayout from "../components/account/AuthLayout";
import FormError from "../components/account/FormError";
import PasswordInput from "../components/account/PasswordInput";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", identifier: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      // parseIdentifier gives { email } or { phone }
      const contact = parseIdentifier(values.identifier);
      await registerUser({ name: values.name.trim(), ...contact, password: values.password });
      navigate(getRedirectPath(location.state), { replace: true });
    } catch (error) {
      setServerError(error.message || "Could not create your account. Please try again.");
    }
  };

  return (
    <>
      <Seo title="Create account" description="Create your account." />
      <AuthLayout
        title="Create your account"
        subtitle="Join us to save your details and track your orders."
        footer={
          <>
            Already have an account?{" "}
            <Link
              to="/login"
              state={location.state}
              className="font-medium text-ink underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Input
            label="Full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Email or phone"
            autoComplete="username"
            error={errors.identifier?.message}
            {...register("identifier")}
          />
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <FormError message={serverError} />
          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Create account
          </Button>
        </form>
      </AuthLayout>
    </>
  );
}