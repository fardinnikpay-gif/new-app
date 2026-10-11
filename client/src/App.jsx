import { useEffect, useState } from "react";
import { AUTH_EXPIRED_EVENT } from "./api/axios";
import { getMe } from "./api/authApi";
import { previewCart } from "./api/cartApi";
import { getCategories } from "./api/categoryApi";
import { getProductBySlug, getProducts } from "./api/productApi";
import { getWishlist } from "./api/wishlistApi";
import Button from "./components/ui/Button";
import Container from "./components/ui/Container";
import ErrorState from "./components/ui/ErrorState";
import Select from "./components/ui/Select";
import Skeleton from "./components/ui/Skeleton";
import useAsync from "./hooks/useAsync";

const MAX_JSON_CHARS = 700;

function Json({ value }) {
  const text = JSON.stringify(value, null, 2) ?? "";
  return (
    <pre className="max-h-64 overflow-auto rounded-lg bg-neutral-100 p-3 text-xs">
      {text.length > MAX_JSON_CHARS ? `${text.slice(0, MAX_JSON_CHARS)}\n...` : text}
    </pre>
  );
}

function Panel({ title, request, render }) {
  const { data, loading, error, reload } = request;

  return (
    <section className="space-y-3 rounded-lg border border-line p-4">
      <h2 className="text-lg font-medium">{title}</h2>
      {loading && <Skeleton className="h-16 w-full" />}
      {!loading && error && (
        <ErrorState message={`${error.message} (status ${error.status})`} onRetry={reload} className="py-6" />
      )}
      {!loading && !error && data && (render ? render(data) : <Json value={data} />)}
    </section>
  );
}

function PreviewTester({ product }) {
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    const variant = product.variants?.[0];
    setBusy(true);
    try {
      const items = [{ productId: product._id, size: variant?.size, color: variant?.color, qty: 1 }];
      setResult(await previewCart({ items }));
    } catch (error) {
      setResult({ error });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button size="sm" loading={busy} onClick={run}>
        Test /cart/preview with the first product
      </Button>
      {result && <Json value={result} />}
    </div>
  );
}

export default function App() {
  const [sort, setSort] = useState("newest");
  const [onSale, setOnSale] = useState(false);
  const [expiredCount, setExpiredCount] = useState(0);

  useEffect(() => {
    const handleExpired = () => setExpiredCount((count) => count + 1);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, []);

  const categories = useAsync(({ signal }) => getCategories({ signal }), []);
  const products = useAsync(
    ({ signal }) => getProducts({ page: 1, limit: 4, sort, ...(onSale && { onSale: true }) }, { signal }),
    [sort, onSale]
  );
  const missing = useAsync(({ signal }) => getProductBySlug("this-slug-does-not-exist", { signal }), []);
  const me = useAsync(({ signal }) => getMe({ signal }), []);
  const wishlist = useAsync(({ signal }) => getWishlist({ signal }), []);

  return (
    <Container as="main" className="space-y-6 py-12">
      <h1 className="text-4xl">Step 4: API layer test</h1>
      <p className="text-sm text-neutral-500">auth:expired events received: {expiredCount}</p>

      <Panel title="GET /categories" request={categories} />

      <div className="flex flex-wrap items-end gap-4">
        <Select label="Sort" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest">newest</option>
          <option value="price_asc">price_asc</option>
          <option value="price_desc">price_desc</option>
        </Select>
        <label className="flex min-h-11 items-center gap-2">
          <input type="checkbox" checked={onSale} onChange={(event) => setOnSale(event.target.checked)} />
          onSale only
        </label>
      </div>

      <Panel
        title="GET /products"
        request={products}
        render={(data) => (
          <div className="space-y-3">
            <p className="text-sm">
              total: {data.total} | pages: {data.pages} | page: {data.page}
            </p>
            <Json value={data.products.map(({ title, price, discountPrice }) => ({ title, price, discountPrice }))} />
            {data.products[0] && <PreviewTester product={data.products[0]} />}
          </div>
        )}
      />

      <Panel title="GET /products/:slug (missing slug, expect 404)" request={missing} />
      <Panel title="GET /auth/me (guest, expect 401, no event)" request={me} />
      <Panel title="GET /wishlist (guest, expect 401 and one event)" request={wishlist} />
    </Container>
  );
}