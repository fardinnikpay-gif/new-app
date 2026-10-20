import { cx } from "../../utils/cx";
import Spinner from "./Spinner";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  outline: "border border-gray-300 bg-white text-ink hover:bg-gray-50",
  ghost: "text-ink hover:bg-gray-100",
  danger: "bg-danger text-white hover:bg-danger-dark",
};

const SIZES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

// `as` lets a router <Link> look like a button: <Button as={Link} to="/x">.
// Icon-only buttons must pass aria-label.
export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  className,
  children,
  ...rest
}) {
  const nativeProps = Component === "button" ? { type, disabled: disabled || loading } : {};

  return (
    <Component
      {...nativeProps}
      aria-busy={loading || undefined}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </Component>
  );
}