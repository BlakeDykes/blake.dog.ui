import type { Decorator, Preview } from "@storybook/react-vite";
import "../src/styles/index.scss";
import "./preview.scss";

// The DS never touches data-theme — the host app owns it. In Storybook, the
// toolbar plays the role of the host app.
const withTheme: Decorator = (Story, context) => {
  document.documentElement.dataset.theme = String(
    context.globals.theme ?? "light"
  );
  return <Story />;
};

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
