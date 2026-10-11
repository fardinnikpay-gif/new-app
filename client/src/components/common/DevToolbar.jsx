import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  "/",
  "/shop",
  "/product/test-slug",
  "/cart",
  "/checkout",
  "/login",
  "/register",
  "/account",
  "/account/orders",
  "/about",
  "/nope",
];

// Temporary testing aid until the real Header and Login page exist.
export default function DevToolbar() {
  const { user, loading, login, logout } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [message, setMessage] = useState("");

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const run = async (action) => {
    setMessage("");
    try {
      await action();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <details className="fixed bottom-2 left-2 z-[70] max-w-xs rounded-lg border border-line bg-surface p-2 text-xs shadow-lift">
      <summary className="cursor-pointer font-medium">Dev toolbar</summary>
      <div className="mt-2 space-y-2">
        <nav className="flex flex-wrap gap-x-3 gap-y-1">
          {LINKS.map((path) => (
            <Link key={path} to={path} className="text-primary underline">
              {path}
            </Link>
          ))}
        </nav>
        <p>{loading ? "checking session..." : user ? `logged in: ${user.name}` : "guest"}</p>
        <div className="flex gap-1">
          <input
            aria-label="Email or phone"
            placeholder="email or phone"
            value={form.identifier}
            onChange={update("identifier")}
            className="w-28 rounded-lg border border-line-strong px-2 py-1"
          />
          <input
            aria-label="Password"
            type="password"
            placeholder="password"
            value={form.password}
            onChange={update("password")}
            className="w-24 rounded-lg border border-line-strong px-2 py-1"
          />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => run(() => login(form.identifier, form.password))} className="underline">
            Login
          </button>
          <button type="button" onClick={() => run(logout)} className="underline">
            Logout
          </button>
        </div>
        {message && <p className="text-danger">{message}</p>}
      </div>
    </details>
  );
}