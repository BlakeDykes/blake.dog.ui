/**
 * @blakedykes/nes token build — emits src/styles/_tokens.scss:
 *   @layer structural   the NES hardware palette pool (--nes-*)
 *   @layer identity     [data-identity="nes"] populates the core contract
 *
 * The identity block references the palette via var() (outputReferences) and is
 * asserted to (a) keep that alias chain and (b) populate every core contract
 * token. Capability tokens NES lacks (glow, scanline) are simply absent.
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
      selector: '[data-identity="nes"]',
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
