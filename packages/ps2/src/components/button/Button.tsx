import { Button as CoreButton, cx, type ButtonProps } from "@blakedykes/core";
import styles from "./Button.module.scss";

/** PS2-skinned button: chrome gradient, neon glow, smooth uppercase type. */
export function Button({ className, ...props }: ButtonProps) {
  return <CoreButton {...props} className={cx(styles.button, className)} />;
}
