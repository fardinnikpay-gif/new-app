import Spinner from "../ui/Spinner";

export default function FullPageSpinner() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-primary">
      <Spinner size="lg" />
    </div>
  );
}