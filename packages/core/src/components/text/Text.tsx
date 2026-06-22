import { useRender } from "@base-ui/react/use-render";

export type TextTone = "primary" | "display" | "accent";

export type TextShadow = "shadow" | "outline" | false | undefined;

export type TextSize = "small" | "medium" | "large";

export interface TextState extends Record<string, unknown> {
  tone: TextTone;
}

export interface TextProps extends useRender.ComponentProps<"span", TextState> {
  tone?: TextTone;
  size?: TextSize;
  shadow?: TextShadow;
}

/**
 * Headless text. Renders a `<span>` with `data-tone`; identity packages own the
 * type treatment (bitmap/all-caps/pixelated for NES, smooth + drop-shadow for
 * PS2) via `className`. Polymorphic through `render` (e.g. an `<h1>`).
 */
export function Text({
  tone = "primary",
  size = "small",
  shadow = false,
  className,
  render,
  ref,
  ...props
}: TextProps) {
  return useRender({
    render,
    ref,
    defaultTagName: "span",
    state: { tone, size, shadow },
    props: {
      ...props,
      className,
    },
  });
}
