import { useRender } from "@base-ui/react/use-render";
import { cx } from "@/utils/cx";
import styles from "./Link.module.scss";

export type LinkUnderline = "always" | "hover";

export interface LinkState extends Record<string, unknown> {
  underline: LinkUnderline;
}

export interface LinkProps extends useRender.ComponentProps<"a", LinkState> {
  underline?: LinkUnderline;
}

/**
 * Router-agnostic styled anchor. Compose with a routing library via `render`:
 * `<Link render={<RouterLink to="/about" />}>About</Link>`
 */
export function Link({
  underline = "always",
  className,
  render,
  ref,
  ...props
}: LinkProps) {
  return useRender({
    render,
    ref,
    defaultTagName: "a",
    state: { underline },
    props: {
      ...props,
      className: cx(styles.link, className),
    },
  });
}
