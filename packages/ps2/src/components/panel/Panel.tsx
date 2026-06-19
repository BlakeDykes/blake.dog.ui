import { Panel as CorePanel, cx, type PanelProps } from "@blakedykes/core";
import styles from "./Panel.module.scss";

/** PS2-skinned window: translucent glass, beveled edges, scanline overlay. */
export function Panel({ className, ...props }: PanelProps) {
  return <CorePanel {...props} className={cx(styles.panel, className)} />;
}
