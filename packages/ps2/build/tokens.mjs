/**
 * @blakedykes/ps2 token build — emits src/styles/_tokens.scss:
 *   @layer structural   the PS2 chrome/neon pool + glow/scanline recipes (--ps2-*)
 *   @layer identity     [data-identity="ps2"] populates the core contract
 *
 * Glow and scanline are PS2-only capability primitives — they live here, NOT in
 * the universal contract, so NES never carries them (no zeroed tokens).
 */
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { buildLayeredTokens } from "../../../build/tokens.mjs";

const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const corePkg = path.resolve(pkg, "../core");
const token = (file) => path.join(pkg, "tokens", file);

// Token files whose edits should regenerate _tokens.scss (watched in dev). The
// core contract is included because the identity build asserts against it.
export const tokenSources = [
  token("primitives.json"),
  token("identity.json"),
  path.join(corePkg, "tokens/contract.json"),
];

export function buildTokens({ throwOnError = false } = {}) {
  return buildLayeredTokens({
    throwOnError,
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
}

// `node build/tokens.mjs` (the tokens:build script / prebuild).
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await buildTokens();
}
