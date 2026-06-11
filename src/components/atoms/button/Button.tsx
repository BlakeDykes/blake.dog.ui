import { useRender } from "@base-ui/react/use-render";
import { cx } from "@/utils/cx";
import styles from "./Button.module.scss";

export type ButtonVariant = "solid" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonState extends Record<string, unknown> {
  variant: ButtonVariant;
  size: ButtonSize;
}

export interface ButtonProps extends useRender.ComponentProps<
  "button",
  ButtonState
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "solid",
  size = "md",
  className,
  render,
  ref,
  ...props
}: ButtonProps) {
  return useRender({
    render,
    ref,
    defaultTagName: "button",
    // state keys become data-* attributes: data-variant / data-size
    state: { variant, size },
    props: {
      type: "button",
      ...props,
      className: cx(styles.button, className),
    },
  });
}
