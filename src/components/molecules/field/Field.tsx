import { Field as BaseField } from "@base-ui/react/field";
import { cx } from "@/utils/cx";
import styles from "./Field.module.scss";

/**
 * Merge a DS module class with Base UI's `className` prop, which may be a
 * string or a `(state) => string` callback. Mirrors the Toggle pattern.
 */
function mergeClassName<State>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined
) {
  return (state: State) =>
    cx(base, typeof className === "function" ? className(state) : className);
}

export type FieldRootProps = BaseField.Root.Props;
export type FieldLabelProps = BaseField.Label.Props;
export type FieldControlProps = BaseField.Control.Props;
export type FieldDescriptionProps = BaseField.Description.Props;
export type FieldErrorProps = BaseField.Error.Props;

function Root({ className, ...props }: FieldRootProps) {
  return (
    <BaseField.Root
      {...props}
      className={mergeClassName(styles.root, className)}
    />
  );
}

function Label({ className, ...props }: FieldLabelProps) {
  return (
    <BaseField.Label
      {...props}
      className={mergeClassName(styles.label, className)}
    />
  );
}

/**
 * Token-styled text control. Renders an `<input>` that shares the Input atom's
 * box styling, so a bare `<Field.Control />` looks identical to `<Input />`.
 */
function Control({ className, ...props }: FieldControlProps) {
  return (
    <BaseField.Control
      {...props}
      className={mergeClassName(styles.control, className)}
    />
  );
}

function Description({ className, ...props }: FieldDescriptionProps) {
  return (
    <BaseField.Description
      {...props}
      className={mergeClassName(styles.description, className)}
    />
  );
}

function Error({ className, ...props }: FieldErrorProps) {
  return (
    <BaseField.Error
      {...props}
      className={mergeClassName(styles.error, className)}
    />
  );
}

/**
 * Token-styled Base UI Field. Compose the parts:
 *
 * ```tsx
 * <Field.Root name="email">
 *   <Field.Label>Email</Field.Label>
 *   <Field.Control />            // or <Input /> from the atom
 *   <Field.Description>We never share it.</Field.Description>
 *   <Field.Error />
 * </Field.Root>
 * ```
 */
export const Field = {
  Root,
  Label,
  Control,
  Description,
  Error,
};
