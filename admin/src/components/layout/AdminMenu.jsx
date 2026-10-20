import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/Button";

export default function AdminMenu() {
  const { admin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const containerRef = useRef(null);
  const toggleRef = useRef(null);
  const panelId = useId();
  const displayName = admin?.name || admin?.email || "Admin";

  // Close on outside click and Esc (focus returns to the toggle button).
  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout(); // ProtectedRoute redirects to /login once admin is null.
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-gray-100"
      >
        <UserRound className="size-5" aria-hidden="true" />
        <span className="sr-only">Account menu: </span>
        <span className="hidden max-w-40 truncate sm:inline">{displayName}</span>
        <ChevronDown className="size-4 text-gray-500" aria-hidden="true" />
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute right-0 z-40 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-overlay"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
            {admin?.email && admin.email !== displayName && (
              <p className="truncate text-xs text-gray-500">{admin.email}</p>
            )}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
            loading={loggingOut}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}