// @blakedykes/core — headless game-UI primitives + the token contract cascade.
// The side-effect import ships dist/core.css: the @layer declaration, structural
// scaffolding, and invariants floors. Install an identity package (@blakedykes/nes
// or /ps2) to populate the contract and skin these components.
import "@/styles/index.scss";

export { cx } from "@/utils/cx";
export {
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonState,
  type ButtonVariant,
} from "@/components/button";
export {
  Panel,
  type PanelProps,
  type PanelState,
  type PanelSurface,
} from "@/components/panel";
export {
  Text,
  type TextProps,
  type TextState,
  type TextTone,
} from "@/components/text";
