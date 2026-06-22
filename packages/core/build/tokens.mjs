/**
 * @blakedykes/core token build — emits src/styles/_tokens.scss:
 *   @layer structural   agnostic scaffolding (z-index, focus-ring metrics, motion)
 *   @layer invariants   floors no identity/brand may override (reduced-motion today)
 *
 * Core ships NO contract values — installing an identity package populates the
 * contract under [data-identity]. tokens/contract.json is the manifest the
 * identity builds assert against (see build/tokens.mjs at the repo root).
 */
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { buildLayeredTokens } from "../../../build/tokens.mjs";

const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const token = (file) => path.join(pkg, "tokens", file);

// Token files whose edits should regenerate _tokens.scss (watched in dev).
export const tokenSources = [token("structural.json")];

export function buildTokens({ throwOnError = false } = {}) {
  return buildLayeredTokens({
    throwOnError,
    outFile: path.join(pkg, "src/styles/_tokens.scss"),
    blocks: [
      { layer: "structural", sources: [token("structural.json")] },
      {
        layer: "invariants",
        raw: [
          "/* Floors no identity or brand may override (expanded in a later phase). */",
          "@media (prefers-reduced-motion: reduce) {",
          "  :root {",
          "    --motion-duration-fast: 0ms;",
          "    --motion-duration-normal: 0ms;",
          "  }",
          "}",
        ].join("\n"),
      },
    ],
  });
}

// `node build/tokens.mjs` (the tokens:build script / prebuild).
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await buildTokens();
}
