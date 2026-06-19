import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import sassDts from "vite-plugin-sass-dts";

export default defineConfig({
  plugins: [
    react(),
    sassDts(),
    dts({ tsconfigPath: "./tsconfig.json", include: ["src"] }),
  ],
  resolve: {
    alias: { "@": resolve(import.meta.dirname, "src") },
  },
  css: {
    preprocessorOptions: {
      scss: { loadPaths: [resolve(import.meta.dirname, "src")] },
    },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@base-ui\/react($|\/)/,
        /^@blakedykes\/core($|\/)/,
      ],
      output: {
        assetFileNames(assetInfo) {
          const name = assetInfo.names[0] ?? "";
          return name.endsWith(".css")
            ? "styles.css"
            : "assets/[name][extname]";
        },
      },
    },
  },
});
