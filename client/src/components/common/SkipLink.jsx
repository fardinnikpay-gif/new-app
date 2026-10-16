// First focusable element on the page. Moves focus straight to <main id="main-content">.
export default function SkipLink() {
  const handleClick = (event) => {
    event.preventDefault();
    document.getElementById("main-content")?.focus();
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
    >
      Skip to main content
    </a>
  );
}