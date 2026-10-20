import { RefreshCw, TriangleAlert } from "lucide-react";
import { isChunkLoadError } from "../../utils/errors";
import Button from "../ui/Button";

// Plain <a> and window.location on purpose: this screen must keep working even when the router
// or the auth context is what crashed, and a full reload resets every piece of state.
export default function ErrorFallback({ error }) {
  const outdated = isChunkLoadError(error);

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div role="alert" className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-card">
        <TriangleAlert className="mx-auto size-10 text-danger" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-bold text-ink">
          {outdated ? "A new version is available" : "Something went wrong"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {outdated
            ? "The panel was updated while this tab was open. Reload to get the latest version."
            : "An unexpected error occurred. Reloading the page usually fixes it."}
        </p>

        {/* Technical details are for developers only and never shown in production. */}
        {import.meta.env.DEV && error?.message && (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-100 p-3 text-left text-xs text-gray-700">
            {error.message}
          </pre>
        )}

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Reload page
          </Button>
          <Button as="a" href="/dashboard" variant="outline">
            Go to dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}