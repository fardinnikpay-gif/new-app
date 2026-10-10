import { forwardRef } from "react";
import { cx } from "../../utils/cx";
import Spinner from "./Spinner";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors transition-transform active:scale-95";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-light",
  outline: "border border-ink bg-white text-ink hover:bg-ink hover:text-white",
  ghost: "text-ink hover:bg-neutral-100",
};

const SIZES = {
  sm: "min-h-11 px-4 text-sm md:min-h-9",
  md: "min-h-11 px-6 text-sm",
  lg: "min-h-12 px-8 text-base",
};

// props: { variant, size, loading, disabled, as, type, onClick, className, ...rest }
const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    as: Component = "button",
    type = "button",
    onClick,
    className,
    children,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;
  const isNativeButton = Component === "button";

  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const stateProps = isNativeButton
    ? { type, disabled: isDisabled }
    : { "aria-disabled": isDisabled || undefined };

  return (
    <Component
      ref={ref}
      {...stateProps}
      aria-busy={loading || undefined}
      onClick={handleClick}
      className={cx(
        BASE,
        VARIANTS[variant],
        SIZES[size],
        isDisabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...rest}
    >
      {loading && <Spinner size="sm" label={null} />}
      {children}
    </Component>
  );
});

export default Button;