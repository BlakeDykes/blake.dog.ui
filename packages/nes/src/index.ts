// @blakedykes/nes — NES (8-bit) identity. Ships dist/styles.css (palette +
// [data-identity="nes"] contract + skins) and the NES-skinned components.
// Pair with @blakedykes/core/core.css; set data-identity="nes" on a root element.
import "@/styles/index.scss";

export { Button } from "@/components/button";
export { Panel } from "@/components/panel";
export { Text } from "@/components/text";
export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  PanelProps,
  PanelSurface,
  TextProps,
  TextTone,
} from "@blakedykes/core";
