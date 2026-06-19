import { useRender } from "@base-ui/react/use-render";
import { cx } from "@/utils/cx";
import styles from "./Box.module.scss";

export type BoxSpace = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface BoxState extends Record<string, unknown> {
  padding: BoxSpace;
}

export interface BoxProps extends useRender.ComponentProps<"div", BoxState> {
  /** Token-scale padding on all sides. */
  padding?: BoxSpace;
}

export function Box({
  padding = "none",
  className,
  render,
  ref,
  ...props
}: BoxProps) {
  return useRender({
    render,
    ref,
    defaultTagName: "div",
    state: { padding },
    props: {
      ...props,
      className: cx(styles.box, className),
    },
  });
}
