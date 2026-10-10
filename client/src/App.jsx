import { useState } from "react";
import Button from "./components/ui/Button";
import Container from "./components/ui/Container";
import Drawer from "./components/ui/Drawer";
import Input from "./components/ui/Input";
import Modal from "./components/ui/Modal";

export default function App() {
  const [modal, setModal] = useState(false);
  const [fullModal, setFullModal] = useState(false);
  const [drawer, setDrawer] = useState({ open: false, side: "right" });
  const [nested, setNested] = useState(false);

  const openDrawer = (side) => setDrawer({ open: true, side });
  const closeDrawer = () => setDrawer((prev) => ({ ...prev, open: false }));

  return (
    <Container as="main" className="space-y-8 py-12">
      <h1 className="text-4xl">Step 3b: Modal and Drawer</h1>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setModal(true)}>Open modal</Button>
        <Button variant="outline" onClick={() => setFullModal(true)}>
          Open full-screen modal
        </Button>
        <Button variant="outline" onClick={() => openDrawer("right")}>
          Drawer (right)
        </Button>
        <Button variant="outline" onClick={() => openDrawer("left")}>
          Drawer (left)
        </Button>
      </div>

      <div className="grid h-[150vh] place-items-start rounded-lg border border-dashed border-line-strong p-6">
        <p className="text-neutral-500">Tall area: open an overlay and try to scroll the page behind it.</p>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Edit details">
        <div className="space-y-4">
          <Input label="Name" placeholder="Focus lands here" data-autofocus />
          <Input label="Email" placeholder="you@example.com" />
          {Array.from({ length: 10 }, (_, i) => (
            <p key={i} className="text-neutral-600">
              Long content to test inner scrolling. Line {i + 1}: Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </p>
          ))}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModal(false)}>Save</Button>
          </div>
        </div>
      </Modal>

      <Modal open={fullModal} onClose={() => setFullModal(false)} title="Search" hideTitle size="full">
        <Input label="Search products" placeholder="Type to search" data-autofocus />
      </Modal>

      <Drawer open={drawer.open} side={drawer.side} onClose={closeDrawer} title="Drawer">
        <div className="space-y-4">
          <p className="text-neutral-600">Press Esc, click outside, or use the close button.</p>
          <Button onClick={() => setNested(true)}>Open nested modal</Button>
        </div>
      </Drawer>

      <Modal open={nested} onClose={() => setNested(false)} title="Nested modal" size="sm">
        <p className="text-neutral-600">Esc closes only this modal, not the drawer behind it.</p>
      </Modal>
    </Container>
  );
}