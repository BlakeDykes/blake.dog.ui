import type { ElementType } from "react";
import { cx } from "./cx";

/** Map of slot name → element type that overrides the slot's default component. */
export type SlotComponents<Name extends string> = Partial<
  Record<Name, ElementType>
>;

/** Map of slot name → props forwarded to that slot's component. */
export type SlotProps<Map extends Record<string, object>> = Partial<Map>;

/**
 * Pick a slot's component (consumer override or the component's default) and
 * merge the component's own default props with the consumer's slotProps,
 * joining className via cx so a default slot class survives an override.
 * Not a hook — plain resolution, safe to call conditionally.
 */
export function resolveSlot<P extends { className?: string }>(
  override: ElementType | undefined,
  fallback: ElementType,
  defaultProps: Partial<P>,
  slotProps?: Partial<P>
): readonly [ElementType, P] {
  const Component = override ?? fallback;
  const props = {
    ...defaultProps,
    ...slotProps,
    className: cx(defaultProps.className, slotProps?.className),
  } as P;
  return [Component, props] as const;
}
