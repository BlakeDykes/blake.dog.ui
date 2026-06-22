import { Button as CoreButton, cx, type ButtonProps } from "@blakedykes/core";
import { Text } from "@/components/text";
import styles from "./Button.module.scss";

/** NES-skinned button: flat fill, chunky hard border, uppercase bitmap type. */
export function Button({ className, slots, ...props }: ButtonProps) {
  return (
    <CoreButton
      {...props}
      // Default the label to the NES-skinned Text; consumer can still override.
      slots={{ text: Text, ...slots }}
      className={cx(styles.button, className)}
    />
  );
}
