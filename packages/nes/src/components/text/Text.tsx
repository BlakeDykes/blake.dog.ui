import { Text as CoreText, cx, type TextProps } from "@blakedykes/core";
import styles from "./Text.module.scss";

/** NES-skinned text: uppercase, pixelated bitmap type. */
export function Text({ className, ...props }: TextProps) {
  return <CoreText {...props} className={cx(styles.text, className)} />;
}
