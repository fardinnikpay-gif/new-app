import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";

// Warns before leaving a dirty form: in-app navigation (router blocker) and
// closing/reloading the tab (beforeunload). Call allowLeave() right after a successful save.
export default function useUnsavedChanges(isDirty) {
  const allowLeaveRef = useRef(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !allowLeaveRef.current && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (!isDirty) return undefined;

    const handleBeforeUnload = (event) => {
      if (allowLeaveRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const allowLeave = useCallback(() => {
    allowLeaveRef.current = true;
  }, []);

  return { blocker, allowLeave };
}