import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "../ui/Input";

// Works with react-hook-form's register() because the ref is forwarded.
const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="rounded p-1 text-gray-500 hover:text-ink"
        >
          <Icon className="size-5" aria-hidden="true" />
        </button>
      }
      {...props}
    />
  );
});

export default PasswordInput;