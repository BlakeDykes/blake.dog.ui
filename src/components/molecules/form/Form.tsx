import { Form as BaseForm } from "@base-ui/react/form";
import { cx } from "@/utils/cx";
import styles from "./Form.module.scss";

export type FormProps<
  FormValues extends Record<string, unknown> = Record<string, unknown>,
> = BaseForm.Props<FormValues>;

/**
 * Thin token-styled wrapper over Base UI Form. Carries the same submit and
 * server-error wiring as Base UI: pass `errors` (keyed by field `name`) to
 * surface server-side validation, and `onFormSubmit` for submit handling.
 * Composes with React Hook Form — drive submission with RHF's `handleSubmit`
 * on `onSubmit`, or use `errors` to forward server errors to the right Field.
 */
export function Form<
  FormValues extends Record<string, unknown> = Record<string, unknown>,
>({ className, ...props }: FormProps<FormValues>) {
  return (
    <BaseForm
      {...props}
      className={(state) =>
        cx(
          styles.form,
          typeof className === "function" ? className(state) : className
        )
      }
    />
  );
}
