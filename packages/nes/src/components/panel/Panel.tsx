import { Panel as CorePanel, cx, type PanelProps } from "@blakedykes/core";
import styles from "./Panel.module.scss";

/** NES-skinned window: opaque fill, hard white frame, no rounding. */
export function Panel({ className, ...props }: PanelProps) {
  return <CorePanel {...props} className={cx(styles.panel, className)} />;
}
