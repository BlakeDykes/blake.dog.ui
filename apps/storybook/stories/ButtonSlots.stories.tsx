import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import * as Nes from "@blakedykes/nes";

/**
 * The MUI-style slots API on `Button`. The label is rendered through the `text`
 * slot — a (skinned) `Text` by default. `slotProps.text` forwards props to it;
 * `slots.text` swaps the component entirely. Shown under `data-identity="nes"`
 * so the default label keeps the NES text treatment.
 */
const meta: Meta = {
  title: "Showcase/Button Slots",
  parameters: { layout: "fullscreen" },
};
export default meta;

const { Button } = Nes;

/** A bespoke label component for the `slots.text` override demo. */
function BracketLabel({ children }: { children?: ReactNode }) {
  return <span>[ {children} ]</span>;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <code style={{ minWidth: 280, opacity: 0.7 }}>{label}</code>
      {children}
    </div>
  );
}

export const Slots: StoryObj = {
  render: () => (
    <div
      data-identity="nes"
      style={{
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        background: "var(--color-surface-scene)",
      }}
    >
      <Nes.Panel>
        <Row label="default (skinned Text label)">
          <Button>Confirm</Button>
        </Row>

        <Row label='slotProps={{ text: { shadow: "outline", tone: "accent" } }}'>
          <Button slotProps={{ text: { shadow: "outline" } }}>Forwarded</Button>
        </Row>

        <Row label="slots={{ text: BracketLabel }}">
          <Button slots={{ text: BracketLabel }}>Overridden</Button>
        </Row>
      </Nes.Panel>
    </div>
  ),
};
