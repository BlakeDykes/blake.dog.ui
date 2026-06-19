import type { Decorator, Preview } from "@storybook/react-vite";

// The real consumer interface: core ships the cascade + structural + invariants;
// each identity package ships its tokens + skins. Importing both identity
// stylesheets here is a demo-only convenience so the toolbar can flip between
// them — a real game installs just one.
import "@blakedykes/core/core.css";
import "@blakedykes/nes/styles.css";
import "@blakedykes/ps2/styles.css";

// The DS never sets data-identity — the consuming app owns it. In Storybook the
// toolbar plays that role for the page root; individual stories may also scope
// data-identity on a wrapper to show identities side by side.
const withIdentity: Decorator = (Story, context) => {
  document.documentElement.dataset.identity = String(
    context.globals.identity ?? "nes"
  );
  return <Story />;
};

const preview: Preview = {
  globalTypes: {
    identity: {
      description: "Console identity (sets data-identity on <html>)",
      toolbar: {
        title: "Identity",
        icon: "paintbrush",
        items: ["nes", "ps2"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { identity: "nes" },
  decorators: [withIdentity],
  parameters: {
    layout: "fullscreen",
    backgrounds: { disable: true },
  },
};

export default preview;
