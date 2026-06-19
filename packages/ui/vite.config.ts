import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import sassDts from "vite-plugin-sass-dts";

export default defineConfig({
  plugins: [
    react(),
    sassDts(),
    dts({
      tsconfigPath: "./tsconfig.json",
      include: ["src"],
      exclude: ["src/**/*.stories.tsx", "src/docs"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      // lets module SCSS do `@use "styles/mixins"` regardless of nesting depth
      scss: { loadPaths: [resolve(import.meta.dirname, "src")] },
    },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    // one stylesheet: tokens (:root + dark) + all component module CSS
    cssCodeSplit: false,
    rollupOptions: {
      // peer deps stay external — the consumer provides React and Base UI
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@base-ui\/react($|\/)/],
      output: {
        assetFileNames(assetInfo) {
          const name = assetInfo.names[0] ?? "";
          return name.endsWith(".css") ? "style.css" : "assets/[name][extname]";
        },
      },
    },
  },
});
