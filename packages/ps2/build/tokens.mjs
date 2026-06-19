/**
 * @blakedykes/ps2 token build — emits src/styles/_tokens.scss:
 *   @layer structural   the PS2 chrome/neon pool + glow/scanline recipes (--ps2-*)
 *   @layer identity     [data-identity="ps2"] populates the core contract
 *
 * Glow and scanline are PS2-only capability primitives — they live here, NOT in
 * the universal contract, so NES never carries them (no zeroed tokens).
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildLayeredTokens } from "../../../build/tokens.mjs";

const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const corePkg = path.resolve(pkg, "../core");
const token = (file) => path.join(pkg, "tokens", file);

await buildLayeredTokens({
  outFile: path.join(pkg, "src/styles/_tokens.scss"),
  blocks: [
    { layer: "structural", sources: [token("primitives.json")] },
    {
      layer: "identity",
      selector: '[data-identity="ps2"]',
      sources: [token("primitives.json"), token("identity.json")],
      filter: (t) => t.filePath.endsWith("identity.json"),
      outputReferences: true,
    },
  ],
  assert: {
    identityKeepsRefs: true,
    contractFrom: path.join(corePkg, "tokens/contract.json"),
  },
});
