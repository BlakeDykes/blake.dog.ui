import {
  Toggle as BaseToggle,
  type ToggleProps as BaseToggleProps,
} from "@base-ui/react/toggle";
import { cx } from "@/utils/cx";
import styles from "./Toggle.module.scss";

export type ToggleProps<Value extends string = string> = BaseToggleProps<Value>;

/**
 * Styled Base UI Toggle. Pressed state is styled via the `[data-pressed]`
 * attribute Base UI sets on the rendered button.
 */
export function Toggle<Value extends string = string>({
  className,
  ...props
}: ToggleProps<Value>) {
  return (
    <BaseToggle
      {...props}
      className={(state) =>
        cx(
          styles.toggle,
          typeof className === "function" ? className(state) : className
        )
      }
    />
  );
}
