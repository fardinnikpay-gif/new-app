import { useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import Badge from "./components/ui/Badge";
import Breadcrumbs from "./components/ui/Breadcrumbs";
import Button from "./components/ui/Button";
import Container from "./components/ui/Container";
import EmptyState from "./components/ui/EmptyState";
import ErrorState from "./components/ui/ErrorState";
import Input from "./components/ui/Input";
import QuantityInput from "./components/ui/QuantityInput";
import SectionHeading from "./components/ui/SectionHeading";
import Select from "./components/ui/Select";
import Skeleton from "./components/ui/Skeleton";
import Spinner from "./components/ui/Spinner";

const CRUMBS = [
  { label: "Home", to: "/" },
  { label: "Men", to: "/shop?category=men" },
  { label: "T-shirts" },
];

export default function App() {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(true);

  const toggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <BrowserRouter>
      <Container as="main" className="space-y-12 py-12">
        <Breadcrumbs items={CRUMBS} />
        <SectionHeading eyebrow="Step 3a" title="Base UI components" description="Temporary test page." />

        <section className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button loading={loading} onClick={toggleLoading}>
            Click to load
          </Button>
          <Button disabled>Disabled</Button>
          <Button as={Link} to="/shop" variant="outline">
            As Link
          </Button>
        </section>

        <section className="flex flex-wrap items-center gap-4">
          <Badge tone="sale">Sale</Badge>
          <Badge tone="new">New</Badge>
          <Badge>Neutral</Badge>
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
          <QuantityInput value={qty} onChange={setQty} max={3} />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Input label="Email" placeholder="you@example.com" />
          <Input label="With error" defaultValue="oops" error="This field is invalid" />
          <Select label="Size" defaultValue="m">
            <option value="s">S</option>
            <option value="m">M</option>
            <option value="l">L</option>
          </Select>
          <Select label="Select with error" error="Please choose a size">
            <option value="">Choose...</option>
          </Select>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Skeleton className="aspect-[4/5] w-full" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <EmptyState
            title="No products found"
            description="Try a different filter."
            action={<Button variant="outline">Clear filters</Button>}
          />
          {hasError ? (
            <ErrorState message="Could not load products." onRetry={() => setHasError(false)} />
          ) : (
            <p className="self-center text-center text-neutral-500">Retry worked.</p>
          )}
        </section>
      </Container>
    </BrowserRouter>
  );
}