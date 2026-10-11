import { Toaster as HotToaster } from "react-hot-toast";

const TOAST_DURATION_MS = 3500;

const TOAST_OPTIONS = {
  duration: TOAST_DURATION_MS,
  style: {
    background: "var(--color-surface)",
    color: "var(--color-ink)",
    border: "1px solid var(--color-line)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lift)",
    fontSize: "0.875rem",
  },
  success: { iconTheme: { primary: "var(--color-primary)", secondary: "var(--color-surface)" } },
  error: { iconTheme: { primary: "var(--color-danger)", secondary: "var(--color-surface)" } },
};

// Brand-styled toast container. Mount it once, inside the providers.
export default function Toaster() {
  return (
    <HotToaster
      position="bottom-center"
      toastOptions={TOAST_OPTIONS}
      containerStyle={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    />
  );
}