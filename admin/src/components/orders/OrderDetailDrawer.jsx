import { getShortOrderId } from "../../utils/order";
import Drawer from "../ui/Drawer";
import OrderDetailContent from "./OrderDetailContent";

// Shell only: the content (and its request) exists only while the drawer is open.
// orderId is kept by the page after closing, so the title does not flip during the exit animation.
export default function OrderDetailDrawer({ orderId, preview, open, onClose, onOrderUpdated }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={orderId ? `Order #${getShortOrderId(orderId)}` : "Order"}
      size="lg"
    >
      {orderId && (
        <OrderDetailContent
          key={orderId}
          orderId={orderId}
          preview={preview}
          onOrderUpdated={onOrderUpdated}
        />
      )}
    </Drawer>
  );
}