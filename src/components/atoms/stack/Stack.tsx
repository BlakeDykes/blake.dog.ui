import { useRender } from "@base-ui/react/use-render";
import { cx } from "@/utils/cx";
import styles from "./Stack.module.scss";

export type StackDirection = "row" | "column";
export type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type StackAlign = "start" | "center" | "end" | "stretch";
export type StackJustify = "start" | "center" | "end" | "between";

export interface StackState extends Record<string, unknown> {
  direction: StackDirection;
  gap: StackGap;
  align: StackAlign;
  justify: StackJustify;
  wrap: boolean;
}

export interface StackProps extends useRender.ComponentProps<
  "div",
  StackState
> {
  direction?: StackDirection;
  /** Token-scale gap between children. */
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
}

export function Stack({
  direction = "column",
  gap = "sm",
  align = "stretch",
  justify = "start",
  wrap = false,
  className,
  render,
  ref,
  ...props
}: StackProps) {
  return useRender({
    render,
    ref,
    defaultTagName: "div",
    state: { direction, gap, align, justify, wrap },
    props: {
      ...props,
      className: cx(styles.stack, className),
    },
  });
}
