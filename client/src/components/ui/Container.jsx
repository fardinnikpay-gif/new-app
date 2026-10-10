import { cx } from "../../utils/cx";

// props: { as, className, children, ...rest }
export default function Container({ as: Component = "div", className, children, ...rest }) {
  return (
    <Component className={cx("mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8", className)} {...rest}>
      {children}
    </Component>
  );
}