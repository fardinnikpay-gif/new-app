import { useEffect } from "react";

// Sets document.title while the calling component is mounted, then restores the previous one,
// so leaving the layout (e.g. on logout) does not leave a stale page title behind.
export default function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}