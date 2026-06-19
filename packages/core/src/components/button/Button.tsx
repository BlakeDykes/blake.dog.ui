import { useRender } from "@base-ui/react/use-render";

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

/**
 * Headless button. Renders a `<button>` with `data-variant`/`data-size` and the
 * native `type`; carries no visuals — an identity package skins it by injecting
 * its own class via `className`. Polymorphic through `render`.
 */
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
    // state keys become data-* attributes the skin selects on
    state: { variant, size },
    props: {
      type: "button",
      ...props,
      className,
    },
  });
}
