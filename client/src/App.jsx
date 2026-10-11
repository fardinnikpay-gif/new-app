import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AUTH_EXPIRED_EVENT } from "./api/axios";
import { getProducts } from "./api/productApi";
import Toaster from "./components/common/Toaster";
import Button from "./components/ui/Button";
import Container from "./components/ui/Container";
import Input from "./components/ui/Input";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { UIProvider, useUI } from "./context/UIContext";
import { WishlistProvider, useWishlist } from "./context/WishlistContext";
import useAsync from "./hooks/useAsync";
import { CART_BUMP_EVENT } from "./utils/cart";

function Section({ title, children }) {
  return (
    <section className="space-y-3 rounded-lg border border-line p-4">
      <h2 className="text-lg font-medium">{title}</h2>
      {children}
    </section>
  );
}

function AuthPanel() {
  const { user, loading, login, register, logout, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: "", identifier: "", password: "" });
  const [message, setMessage] = useState("");

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  const run = async (action) => {
    setMessage("");
    try {
      await action();
    } catch (error) {
      setMessage(`${error.message} (status ${error.status})`);
    }
  };
  const handleRegister = () =>
    run(() =>
      register({
        name: form.name,
        password: form.password,
        ...(form.identifier.includes("@") ? { email: form.identifier } : { phone: form.identifier }),
      })
    );

  return (
    <Section title="AuthContext">
      <p className="text-sm">
        loading: {String(loading)} | user: {user ? `${user.name} (${user.email ?? user.phone})` : "guest"}
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <Input label="Name (register only)" value={form.name} onChange={update("name")} />
        <Input label="Email or phone" value={form.identifier} onChange={update("identifier")} />
        <Input label="Password" type="password" value={form.password} onChange={update("password")} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => run(() => login(form.identifier, form.password))}>Login</Button>
        <Button variant="outline" onClick={handleRegister}>Register</Button>
        <Button variant="outline" onClick={() => run(logout)}>Logout</Button>
        <Button variant="ghost" onClick={() => run(refreshUser)}>Refresh user</Button>
        <Button variant="ghost" onClick={() => window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))}>
          Simulate session expiry
        </Button>
      </div>
      {message && <p role="alert" className="text-sm text-danger">{message}</p>}
    </Section>
  );
}

function CartPanel({ products }) {
  const { items, totalCount, addItem, updateQty, removeItem, clearCart } = useCart();
  const [bumps, setBumps] = useState(0);
  const [last, setLast] = useState(null);

  useEffect(() => {
    const handleBump = () => setBumps((count) => count + 1);
    window.addEventListener(CART_BUMP_EVENT, handleBump);
    return () => window.removeEventListener(CART_BUMP_EVENT, handleBump);
  }, []);

  const add = (product, qty) => {
    const variant = product.variants?.[0];
    setLast(addItem(product, variant?.size, variant?.color, qty));
  };

  return (
    <Section title="CartContext">
      <p className="text-sm">totalCount: {totalCount} | bump events: {bumps}</p>
      {products.map((product) => (
        <div key={product._id} className="flex flex-wrap items-center gap-2">
          <span className="text-sm">{product.title}</span>
          <Button size="sm" onClick={() => add(product, 1)}>Add 1</Button>
          <Button size="sm" variant="outline" onClick={() => add(product, 99)}>Add 99 (cap test)</Button>
        </div>
      ))}
      {last && <pre className="rounded-lg bg-neutral-100 p-3 text-xs">{JSON.stringify(last)}</pre>}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.key} className="flex flex-wrap items-center gap-2 text-sm">
            {item.title} ({item.size}, {item.color}) qty {item.qty}/{item.maxQty}
            <Button size="sm" variant="ghost" onClick={() => updateQty(item.key, item.qty - 1)}>-</Button>
            <Button size="sm" variant="ghost" onClick={() => updateQty(item.key, item.qty + 1)}>+</Button>
            <Button size="sm" variant="ghost" onClick={() => removeItem(item.key)}>Remove</Button>
          </li>
        ))}
      </ul>
      <Button variant="outline" onClick={clearCart}>Clear cart</Button>
    </Section>
  );
}

function WishlistPanel({ products }) {
  const { ids, products: saved, loading, error, toggle, load } = useWishlist();

  return (
    <Section title="WishlistContext">
      <p className="text-sm">
        saved: {ids.size} ({saved.length} loaded) | loading: {String(loading)} | error: {error?.message ?? "none"}
      </p>
      <div className="flex flex-wrap gap-3">
        {products.map((product) => (
          <Button
            key={product._id}
            size="sm"
            variant={ids.has(product._id) ? "primary" : "outline"}
            onClick={() => toggle(product._id, product)}
          >
            {ids.has(product._id) ? "Saved" : "Save"}: {product.title}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={() => load()}>Reload</Button>
      </div>
    </Section>
  );
}

function UIPanel() {
  const ui = useUI();

  return (
    <Section title="UIContext">
      <p className="text-sm">
        search: {String(ui.searchOpen)} | mega: {String(ui.megaMenuOpen)} | mobile: {String(ui.mobileMenuOpen)}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button size="sm" onClick={ui.openSearch}>Open search</Button>
        <Button size="sm" onClick={ui.openMegaMenu}>Open mega</Button>
        <Button size="sm" onClick={ui.openMobileMenu}>Open mobile</Button>
        <Button size="sm" variant="outline" onClick={ui.closeAll}>Close all</Button>
      </div>
    </Section>
  );
}

function Playground() {
  const catalog = useAsync(({ signal }) => getProducts({ page: 1, limit: 3 }, { signal }), []);
  const products = catalog.data?.products ?? [];

  return (
    <Container as="main" className="space-y-6 py-12">
      <h1 className="text-4xl">Step 5: Contexts test</h1>
      <AuthPanel />
      <CartPanel products={products} />
      <WishlistPanel products={products} />
      <UIPanel />
    </Container>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <UIProvider>
              <Playground />
              <Toaster />
            </UIProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}