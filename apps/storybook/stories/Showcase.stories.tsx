import type { Meta, StoryObj } from "@storybook/react-vite";
import * as Nes from "@blakedykes/nes";
import * as Ps2 from "@blakedykes/ps2";

/**
 * The architectural proof: the SAME headless components (Button/Panel/Text from
 * @blakedykes/core) rendered through two identity packages. Each column scopes
 * its own `data-identity`, which activates that console's contract token values;
 * the package supplies the skin. No component code differs between columns.
 */
const meta: Meta = {
  title: "Showcase/Identities",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Kit = typeof Nes;

function Demo({ kit, label }: { kit: Kit; label: string }) {
  const { Panel, Text, Button } = kit;
  return (
    <kit.Panel>
      <Text tone="display">{label}</Text>
      <div style={{ marginTop: 12 }}>
        <Text>Press start to continue your adventure.</Text>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Button>Confirm</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
      <div style={{ marginTop: 12 }}>
        <Panel surface="raised" style={{ display: "inline-block" }}>
          <Text>HP 350 / 350</Text>
        </Panel>
      </div>
    </kit.Panel>
  );
}

export const SideBySide: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
      <div
        data-identity="nes"
        style={{
          flex: "1 1 320px",
          padding: 32,
          background: "var(--surface-scene)",
        }}
      >
        <Demo kit={Nes} label="NES IDENTITY" />
      </div>
      <div
        data-identity="ps2"
        style={{
          flex: "1 1 320px",
          padding: 32,
          background: "var(--surface-scene)",
        }}
      >
        <Demo kit={Ps2} label="PS2 Identity" />
      </div>
    </div>
  ),
};
