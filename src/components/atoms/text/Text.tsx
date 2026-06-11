import { useRender } from "@base-ui/react/use-render";
import { cx } from "@/utils/cx";
import styles from "./Text.module.scss";

export type TextSize = "xs" | "sm" | "md" | "lg";
export type TextWeight = "regular" | "medium" | "bold";

export interface TextState extends Record<string, unknown> {
  size: TextSize;
  weight: TextWeight;
  muted: boolean;
}

export interface TextProps extends useRender.ComponentProps<"p", TextState> {
  size?: TextSize;
  weight?: TextWeight;
  muted?: boolean;
}

export function Text({
  size = "md",
  weight = "regular",
  muted = false,
  className,
  render,
  ref,
  ...props
}: TextProps) {
  return useRender({
    render,
    ref,
    defaultTagName: "p",
    state: { size, weight, muted },
    props: {
      ...props,
      className: cx(styles.text, className),
    },
  });
}
