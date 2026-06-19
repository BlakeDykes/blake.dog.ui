import { Button as CoreButton, cx, type ButtonProps } from "@blakedykes/core";
import styles from "./Button.module.scss";

/** NES-skinned button: flat fill, chunky hard border, uppercase bitmap type. */
export function Button({ className, ...props }: ButtonProps) {
  return <CoreButton {...props} className={cx(styles.button, className)} />;
}
