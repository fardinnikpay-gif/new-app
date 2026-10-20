import { useId } from "react";
import { X } from "lucide-react";
import Field from "../ui/Field";
import { fieldClass, getDescribedBy } from "../ui/fieldUtils";

// Recipients box: type an address, then press Enter or comma (or leave the field) to add it.
export default function EmailInput({
  emails,
  text,
  error,
  max,
  disabled = false,
  onTextChange,
  onCommit,
  onRemove,
}) {
  const inputId = useId();
  const hint = `Separate addresses with a comma or press Enter. ${emails.length}/${max} added.`;

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== ",") return;
    event.preventDefault(); // Enter must not submit the form
    onCommit();
  };

  return (
    <div className="space-y-3">
      <Field id={inputId} label="Recipients" error={error} hint={hint}>
        <input
          id={inputId}
          type="text"
          inputMode="email"
          autoComplete="off"
          spellCheck={false}
          value={text}
          disabled={disabled}
          placeholder="name@example.com"
          onChange={(event) => onTextChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={onCommit}
          aria-invalid={error ? true : undefined}
          aria-describedby={getDescribedBy(inputId, error, hint)}
          className={fieldClass(Boolean(error))}
        />
      </Field>

      {emails.length > 0 && (
        <ul aria-label="Added recipients" className="flex flex-wrap gap-2">
          {emails.map((email) => (
            <li
              key={email}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm text-ink"
            >
              {email}
              <button
                type="button"
                onClick={() => onRemove(email)}
                disabled={disabled}
                aria-label={`Remove ${email}`}
                className="rounded-full p-1 text-gray-500 hover:text-danger disabled:opacity-40"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}