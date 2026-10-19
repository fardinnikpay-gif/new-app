import { useState } from "react";
import Badge from "./components/ui/Badge";
import Button from "./components/ui/Button";
import Checkbox from "./components/ui/Checkbox";
import ConfirmDialog from "./components/ui/ConfirmDialog";
import Drawer from "./components/ui/Drawer";
import EmptyState from "./components/ui/EmptyState";
import ErrorState from "./components/ui/ErrorState";
import Input from "./components/ui/Input";
import Modal from "./components/ui/Modal";
import Select from "./components/ui/Select";
import Skeleton from "./components/ui/Skeleton";
import Switch from "./components/ui/Switch";
import TableSkeleton from "./components/ui/TableSkeleton";
import Textarea from "./components/ui/Textarea";
import { getColorHex } from "./utils/colors";
import { CATEGORIES } from "./utils/constants";
import { formatDate, formatDateTime, formatPrice } from "./utils/format";

const DEMO_DELAY_MS = 1000;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const categoryOptions = CATEGORIES.map((c) => ({ value: c, label: c[0].toUpperCase() + c.slice(1) }));

function Section({ title, children }) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-card">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(true);

  const handleConfirm = async () => {
    setBusy(true);
    await wait(DEMO_DELAY_MS);
    setBusy(false);
    setConfirmOpen(false);
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl font-bold">UI kit preview (temporary)</h1>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Fields">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Title" placeholder="Classic T-shirt" hint="Shown in the shop" />
          <Input label="Price" type="number" error="Price must be greater than 0" />
          <Select label="Category" options={categoryOptions} placeholder="Select category" />
          <Textarea label="Description" />
          <Checkbox label="Featured product" />
          <div className="flex items-center gap-3">
            <Switch checked={active} onChange={setActive} label="Active" />
            <span className="text-sm">{active ? "Active" : "Inactive"}</span>
          </div>
        </div>
      </Section>

      <Section title="Badges, format, colors">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Neutral</Badge>
          <Badge tone="success">Delivered</Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="info">Processing</Badge>
          <Badge tone="danger">Cancelled</Badge>
          <span className="text-sm">
            {formatPrice(1234.5)} · {formatDate(new Date().toISOString())} ·{" "}
            {formatDateTime(new Date().toISOString())}
          </span>
          {["navy", "red", "unknown"].map((name) => (
            <span key={name} className="inline-flex items-center gap-1 text-sm">
              <span
                className="size-4 rounded-full border border-gray-300"
                style={{ backgroundColor: getColorHex(name) ?? "transparent" }}
              />
              {name}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Loading / empty / error">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <TableSkeleton rows={3} />
          </div>
          <EmptyState title="No orders found" message="Try changing the filters." />
          <ErrorState message="Network error" onRetry={() => {}} />
        </div>
      </Section>

      <Section title="Overlays">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>Open confirm</Button>
        </div>
      </Section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Demo modal">
        <p className="mb-4 text-sm text-gray-600">Esc, backdrop click and Tab trap should work.</p>
        <Input label="Name" />
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Demo drawer">
        <p className="mb-4 text-sm text-gray-600">Open the confirm dialog on top of me.</p>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete something</Button>
      </Drawer>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete item?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
        loading={busy}
      />
    </main>
  );
}