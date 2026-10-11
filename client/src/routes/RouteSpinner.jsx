import Spinner from "../components/ui/Spinner";

// Shown by the guards while the first /auth/me check is running
export default function RouteSpinner() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Spinner size="lg" label="Checking your session" />
    </div>
  );
}