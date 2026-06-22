import type { ElementType } from "react";
import { useRender } from "@base-ui/react/use-render";
import { Text, type TextProps } from "@/components/text";
import { resolveSlot } from "@/utils/slots";

export type ButtonVariant = "solid" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonState extends Record<string, unknown> {
  variant: ButtonVariant;
  size: ButtonSize;
}

export interface ButtonSlots {
  /** Component rendered for the button label. Defaults to `Text`. */
  text?: ElementType;
}

export interface ButtonSlotProps {
  /** Props forwarded to the label slot (default `Text`). */
  text?: TextProps;
}

export interface ButtonProps extends useRender.ComponentProps<
  "button",
  ButtonState
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Override a slot's component (e.g. swap the label `Text`). */
  slots?: ButtonSlots;
  /** Forward props to a slot's component. */
  slotProps?: ButtonSlotProps;
}

/**
 * Headless button. Renders a `<button>` with `data-variant`/`data-size` and the
 * native `type`; carries no visuals — an identity package skins it by injecting
 * its own class via `className`. Polymorphic through `render`. The label is
 * rendered through the `text` slot (a `Text` by default), customizable via
 * `slots`/`slotProps`.
 */
export function Button({
  variant = "solid",
  size = "md",
  className,
  render,
  ref,
  slots,
  slotProps,
  children,
  ...props
}: ButtonProps) {
  const [TextSlot, textProps] = resolveSlot<TextProps>(
    slots?.text,
    Text,
    { children },
    slotProps?.text
  );
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
      children: <TextSlot {...textProps} />,
    },
  });
}
