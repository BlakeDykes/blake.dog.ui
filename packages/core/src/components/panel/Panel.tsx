import { useRender } from "@base-ui/react/use-render";

export type PanelSurface = "panel" | "raised" | "inset";

export interface PanelState extends Record<string, unknown> {
  surface: PanelSurface;
}

export interface PanelProps extends useRender.ComponentProps<
  "div",
  PanelState
> {
  surface?: PanelSurface;
}

/**
 * Headless container — the era-defining windowed surface. Renders a `<div>`
 * with `data-surface`; identity packages skin the frame/fill/texture (a flat
 * hard-bordered NES box, a translucent scanline PS2 panel) via `className` and
 * pseudo-elements. Polymorphic through `render`.
 */
export function Panel({
  surface = "panel",
  className,
  render,
  ref,
  ...props
}: PanelProps) {
  return useRender({
    render,
    ref,
    defaultTagName: "div",
    state: { surface },
    props: {
      ...props,
      className,
    },
  });
}
