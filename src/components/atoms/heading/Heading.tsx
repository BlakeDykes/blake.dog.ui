import { useRender } from "@base-ui/react/use-render";
import { cx } from "@/utils/cx";
import styles from "./Heading.module.scss";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingState extends Record<string, unknown> {
  level: HeadingLevel;
}

export interface HeadingProps extends useRender.ComponentProps<
  "h2",
  HeadingState
> {
  /** Heading level: sets both the rendered tag (h1–h6) and the type scale. */
  level?: HeadingLevel;
}

export function Heading({
  level = 2,
  className,
  render,
  ref,
  ...props
}: HeadingProps) {
  return useRender({
    render,
    ref,
    defaultTagName: `h${level}`,
    state: { level },
    props: {
      ...props,
      className: cx(styles.heading, className),
    },
  });
}
