import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/Button";

// TEMPORARY: lets you click through routes before the real layout exists (step 3).
const LINKS = [
  ["Dashboard", "/dashboard"],
  ["Products", "/products"],
  ["New product", "/products/new"],
  ["Edit product", "/products/123/edit"],
  ["Categories", "/categories"],
  ["Orders", "/orders"],
  ["Coupons", "/coupons"],
  ["Users", "/users"],
  ["404", "/does-not-exist"],
];

export default function StubPage({ title, step }) {
  const { admin, logout } = useAuth();

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-gray-500">
        Placeholder, replaced in step {step}. Signed in as {admin?.name || admin?.email}.
      </p>
      <nav aria-label="Temporary navigation" className="flex flex-wrap gap-2">
        {LINKS.map(([label, to]) => (
          <Link key={to} to={to} className="rounded-lg bg-white px-3 py-1.5 text-sm shadow-card hover:bg-gray-100">
            {label}
          </Link>
        ))}
      </nav>
      <Button variant="outline" onClick={logout}>
        Logout
      </Button>
    </main>
  );
}