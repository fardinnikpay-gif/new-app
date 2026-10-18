import { AlertTriangle } from "lucide-react";
import Button from "../ui/Button";
import { isChunkLoadError } from "../../utils/isChunkLoadError";


// Uses plain <a> links so it also works outside the Router and the Providers.
export default function ErrorPage({ error, onRetry }) {
  const outdated = isChunkLoadError(error);

  return (
    <div
      role="alert"
      className="flex min-h-[60svh] flex-col items-center justify-center px-4 py-16 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-ink">
        <AlertTriangle className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-3xl font-light tracking-tight text-ink md:text-4xl">
        {outdated ? "A new version is available" : "Something went wrong"}
      </h1>
      <p className="mt-3 max-w-md text-neutral-600">
        {outdated
          ? "We've just updated the site. Reload the page to continue."
          : "An unexpected error occurred. You can try again, or head back to the homepage."}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {outdated ? (
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        ) : (
          <Button onClick={onRetry}>Try again</Button>
        )}
        <Button as="a" href="/" variant="outline">
          Back to home
        </Button>
      </div>

      {import.meta.env.DEV && error && (
        <details className="mt-8 max-w-2xl text-left text-sm text-neutral-600">
          <summary className="cursor-pointer">Error details (development only)</summary>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">{error.stack ?? String(error)}</pre>
        </details>
      )}
    </div>
  );
}