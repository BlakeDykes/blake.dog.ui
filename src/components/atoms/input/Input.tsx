import {
  Input as BaseInput,
  type InputProps as BaseInputProps,
} from "@base-ui/react/input";
import { cx } from "@/utils/cx";
import styles from "./Input.module.scss";

export type InputProps = BaseInputProps;

/**
 * Token-styled text control over Base UI Input. Automatically wires to a
 * surrounding `Field`, picking up `[data-invalid]` (and the other field data
 * attributes) for styling. Works with React Hook Form by spreading
 * `register()` onto it: `<Input {...register("email")} />`.
 */
export function Input({ className, ...props }: InputProps) {
  return (
    <BaseInput
      {...props}
      className={(state) =>
        cx(
          styles.input,
          typeof className === "function" ? className(state) : className
        )
      }
    />
  );
}
