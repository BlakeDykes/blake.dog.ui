// @blakedykes/ps2 — PS2-era identity. Ships dist/styles.css (chrome/neon pool +
// glow/scanline recipes + [data-identity="ps2"] contract + skins) and the
// PS2-skinned components. Pair with @blakedykes/core/core.css; set
// data-identity="ps2" on a root element.
import "@/styles/index.scss";

export { Button } from "@/components/button";
export { Panel } from "@/components/panel";
export { Text } from "@/components/text";
export type {
  ButtonProps,
  ButtonSize,
  ButtonSlotProps,
  ButtonSlots,
  ButtonVariant,
  PanelProps,
  PanelSurface,
  TextProps,
  TextTone,
} from "@blakedykes/core";
