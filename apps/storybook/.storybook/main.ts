import type { StorybookConfig } from "@storybook/react-vite";

const workspacePackages = [
  "@blakedykes/core",
  "@blakedykes/nes",
  "@blakedykes/ps2",
];

const config: StorybookConfig = {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    // Don't pre-bundle the workspace packages: esbuild's dep cache wouldn't see
    // their dist rebuilt by `vite build --watch`, so a token/component change
    // wouldn't reach the browser. Excluded, Vite resolves them to the real
    // (pnpm-symlinked) source paths and hot-reloads when dist changes.
    return mergeConfig(config, {
      optimizeDeps: { exclude: workspacePackages },
    });
  },
};

export default config;
