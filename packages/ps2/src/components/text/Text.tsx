import { Text as CoreText, cx, type TextProps } from "@blakedykes/core";
import styles from "./Text.module.scss";

/** PS2-skinned text: smooth face with drop-shadow legibility; glow on display. */
export function Text({ className, ...props }: TextProps) {
  return <CoreText {...props} className={cx(styles.text, className)} />;
}
