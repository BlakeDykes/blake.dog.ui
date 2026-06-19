import type { Decorator, Preview } from "@storybook/react-vite";
import { addons } from "storybook/preview-api";
import "../src/styles/index.scss";
import "./preview.scss";
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events";

const applyTheme = (globals?: { theme?: unknown }) => {
  document.documentElement.dataset.theme = String(globals?.theme ?? "light");
};

const applyBrand = (globals?: { brand?: unknown }) => {
  const brand = String(globals?.brand ?? "none");
  if (brand === "none") delete document.documentElement.dataset.brand;
  else document.documentElement.dataset.brand = brand;
};

// The DS never touches data-theme — the host app owns it. In Storybook, the
// toolbar plays the role of the host app.
const withTheme: Decorator = (Story, context) => {
  document.documentElement.dataset.theme = String(
    context.globals.theme ?? "light"
  );
  document.documentElement.dataset.brand = String(
    context.globals.brand ?? undefined
  );

  return <Story />;
};

const channel = addons.getChannel();
channel.on(SET_GLOBALS, ({ globals }) => {
  applyTheme(globals);
  applyBrand(globals);
});

channel.on(GLOBALS_UPDATED, ({ globals }) => {
  applyTheme(globals);
  applyBrand(globals);
});

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme (sets data-theme on <html>)",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
    brand: {
      description: "Brand layer (sets data-brand on <html>",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: ["none", "kh"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
