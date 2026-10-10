import { cx } from "../../utils/cx";
import Overlay from "./Overlay";

const SIZES = {
  sm: "max-w-sm rounded-lg",
  md: "max-w-lg rounded-lg",
  lg: "max-w-3xl rounded-lg",
  full: "h-full max-w-none",
};

// props: { open, onClose, title, hideTitle, size: sm|md|lg|full, className, children }
// title is required for accessibility; hideTitle keeps it for screen readers only.
export default function Modal({ open, onClose, title, hideTitle = false, size = "md", className, children }) {
  const isFull = size === "full";

  return (
    <Overlay
      open={open}
      onClose={onClose}
      title={title}
      hideTitle={hideTitle}
      kind="modal"
      wrapperClassName={cx("flex items-center justify-center", !isFull && "p-4")}
      panelClassName={cx(
        "relative w-full",
        SIZES[size],
        !isFull && "max-h-[calc(100dvh-2rem)]",
        className
      )}
    >
      {children}
    </Overlay>
  );
}