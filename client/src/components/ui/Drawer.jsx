import { cx } from "../../utils/cx";
import Overlay from "./Overlay";

const SIDES = {
  left: "left-0",
  right: "right-0",
};

const WIDTHS = {
  md: "w-[88%] max-w-sm",
  full: "w-full",
};

// props: { open, onClose, side: left|right, width: md|full, title, hideTitle, className, children }
// Keep `side` constant while closing, otherwise the exit animation changes direction.
export default function Drawer({
  open,
  onClose,
  side = "right",
  width = "md",
  title,
  hideTitle = false,
  className,
  children,
}) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      title={title}
      hideTitle={hideTitle}
      kind={side}
      panelClassName={cx("absolute inset-y-0", SIDES[side], WIDTHS[width], className)}
    >
      {children}
    </Overlay>
  );
}