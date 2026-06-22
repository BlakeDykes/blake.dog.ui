import { Button as CoreButton, cx, type ButtonProps } from "@blakedykes/core";
import { Text } from "@/components/text";
import styles from "./Button.module.scss";

/** PS2-skinned button: chrome gradient, neon glow, smooth uppercase type. */
export function Button({ className, slots, ...props }: ButtonProps) {
  return (
    <CoreButton
      {...props}
      // Default the label to the PS2-skinned Text; consumer can still override.
      slots={{ text: Text, ...slots }}
      className={cx(styles.button, className)}
    />
  );
}
