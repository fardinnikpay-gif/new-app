import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "../ui/Input";

// Works with react-hook-form's register() (ref + props are forwarded to Input).
const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div>
      <Input ref={ref} {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
        className="ml-auto mt-1 flex min-h-11 items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-ink"
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        Show password
      </button>
    </div>
  );
});

export default PasswordInput;