/**
 * Token build: tokens/*.json (DTCG) -> src/styles/_tokens.scss + _tokens-map.scss
 *
 * _tokens.scss is emitted inside a fixed CSS cascade:
 *
 *   @layer structural, identity, brand, invariants;
 *
 * - structural   raw primitive scales (identity-neutral pool)
 * - identity      the contract population (default identity = :root) + theme remaps
 * - brand         [data-brand] overrides/extensions of the identity
 * - invariants    reserved — legibility / flash / ethics floors (a later phase)
 *
 * Components read only the contract names resolved by this cascade; precedence is
 * by layer order, not selector specificity. Values are identical to the previous
 * specificity-based output — this layering is non-breaking.
 *
 * - _tokens-map.scss  Sass $tokens map for compile-time math only — never shipped to consumers
 *
 * Run via `pnpm tokens:build` (cwd must be the repo root).
 */
import StyleDictionary from "style-dictionary";
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";

const TOKENS_DIR = "tokens";
const BUILD_PATH = "src/styles/";

// ---------------------------------------------------------------------------
// Tier-direction validation.
// Style Dictionary only fails on refs that don't resolve; a wrong-direction
// ref that happens to resolve (e.g. component -> primitive) would build fine.
// Enforce: semantic -> primitive only, component -> semantic only,
// primitive -> nothing.
// ---------------------------------------------------------------------------
const TIER_FILES = {
  primitive: ["primitive.json", "primitive.kh.json"],
  semantic: ["semantic.json", "semantic.dark.json", "semantic.kh.json"],
  component: ["component.json"],
};
const ALLOWED_REFS = {
  primitive: [],
  semantic: ["primitive"],
  component: ["semantic"],
};

function collectTokens(node, prefix, out) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (value && typeof value === "object") {
      if ("$value" in value) out.set([...prefix, key].join("."), value);
      else collectTokens(value, [...prefix, key], out);
    }
  }
}

async function validateTierDirection() {
  const pathTier = new Map(); // token path -> tier that defines it
  const perFile = []; // { tier, file, tokens }

  for (const [tier, files] of Object.entries(TIER_FILES)) {
    for (const file of files) {
      const tree = JSON.parse(
        await readFile(path.join(TOKENS_DIR, file), "utf8")
      );
      const tokens = new Map();
      collectTokens(tree, [], tokens);
      perFile.push({ tier, file, tokens });
      for (const tokenPath of tokens.keys()) {
        const existing = pathTier.get(tokenPath);
        if (existing && existing !== tier) {
          throw new Error(
            `Token path "${tokenPath}" is defined in both ${existing} and ${tier} tiers`
          );
        }
        pathTier.set(tokenPath, tier);
      }
    }
  }

  const REF_RE = /\{([^}]+)\}/g;
  const errors = [];
  for (const { tier, file, tokens } of perFile) {
    for (const [tokenPath, token] of tokens) {
      if (typeof token.$value !== "string") continue;
      for (const match of token.$value.matchAll(REF_RE)) {
        const target = match[1];
        const targetTier = pathTier.get(target);
        if (!targetTier) {
          errors.push(
            `${file}: ${tokenPath} references {${target}}, which does not exist`
          );
        } else if (!ALLOWED_REFS[tier].includes(targetTier)) {
          const allowed = ALLOWED_REFS[tier].join(", ") || "nothing";
          errors.push(
            `${file}: ${tokenPath} (${tier}) references {${target}} (${targetTier}) — ` +
              `${tier} tokens may only reference ${allowed}`
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(
      "Token tier-direction validation failed:\n" +
        errors.map((e) => `  - ${e}`).join("\n")
    );
    process.exit(1);
  }
}

await validateTierDirection();

const tokensFile = path.join(BUILD_PATH, "_tokens.scss");

// --- assembly helpers --------------------------------------------------------
// Each Style Dictionary pass writes a tmp CSS block; we strip its generated
// header comment, then wrap the block in its cascade layer before concatenating.
const stripHeader = (s) => s.replace(/^\/\*\*[\s\S]*?\*\/\s*/, "").trimEnd();
const indent = (s) =>
  s
    .split("\n")
    .map((line) => (line.length ? `  ${line}` : line))
    .join("\n");
const layerBlock = (name, body) => `@layer ${name} {\n${indent(body)}\n}\n`;

// Run a CSS pass to a tmp file, return its header-stripped body, and clean up.
async function emitCss(sd, tmpName) {
  await sd.buildAllPlatforms();
  const tmpPath = path.join(BUILD_PATH, tmpName);
  const body = stripHeader(await readFile(tmpPath, "utf8"));
  await rm(tmpPath);
  return body;
}

// ---------------------------------------------------------------------------
// Sass map (_tokens-map.scss) — full token set, build-time DX only. Unchanged.
// ---------------------------------------------------------------------------
const sassMap = new StyleDictionary({
  source: [
    `${TOKENS_DIR}/primitive.json`,
    `${TOKENS_DIR}/semantic.json`,
    `${TOKENS_DIR}/component.json`,
  ],
  platforms: {
    scss: {
      transforms: ["name/kebab"],
      buildPath: BUILD_PATH,
      files: [
        {
          destination: "_tokens-map.scss",
          format: "scss/map-deep",
          options: { mapName: "tokens" },
        },
      ],
    },
  },
});
await sassMap.buildAllPlatforms();

// ---------------------------------------------------------------------------
// @layer structural — raw primitive scales (literals, no references).
// ---------------------------------------------------------------------------
// Note: source entries are globs — always forward slashes, even on Windows.
const structural = new StyleDictionary({
  source: [`${TOKENS_DIR}/primitive.json`],
  platforms: {
    css: {
      transforms: ["name/kebab"],
      buildPath: BUILD_PATH,
      files: [
        {
          destination: "_tokens-structural.tmp.scss",
          format: "css/variables",
          options: { outputReferences: false },
        },
      ],
    },
  },
});
const structuralBody = await emitCss(structural, "_tokens-structural.tmp.scss");

// ---------------------------------------------------------------------------
// @layer identity — the contract population (semantic + component), default
// identity on :root. outputReferences keeps the alias chain visible at runtime
// (--color-accent: var(--color-blue-600); --button-bg-solid: var(--color-accent)),
// which is what lets brand + dark overrides cascade into component tokens.
// primitive.json stays in `source` only so those references resolve.
// ---------------------------------------------------------------------------
const identity = new StyleDictionary({
  source: [
    `${TOKENS_DIR}/primitive.json`,
    `${TOKENS_DIR}/semantic.json`,
    `${TOKENS_DIR}/component.json`,
  ],
  platforms: {
    css: {
      transforms: ["name/kebab"],
      buildPath: BUILD_PATH,
      files: [
        {
          destination: "_tokens-identity.tmp.scss",
          format: "css/variables",
          filter: (token) =>
            token.filePath.endsWith("semantic.json") ||
            token.filePath.endsWith("component.json"),
          options: { outputReferences: true },
        },
      ],
    },
  },
});
const identityBody = await emitCss(identity, "_tokens-identity.tmp.scss");

// ---------------------------------------------------------------------------
// @layer identity (dark remap) — semantic layer only, re-pointed at primitives,
// emitted as a [data-theme="dark"] block. References resolve to literals here
// because the primitives they point at live in the structural block. Dark wins
// over the default identity by source order within the same layer.
// ---------------------------------------------------------------------------
const dark = new StyleDictionary({
  source: [`${TOKENS_DIR}/primitive.json`, `${TOKENS_DIR}/semantic.dark.json`],
  platforms: {
    css: {
      transforms: ["name/kebab"],
      buildPath: BUILD_PATH,
      files: [
        {
          destination: "_tokens-dark.tmp.scss",
          format: "css/variables",
          filter: (token) => token.filePath.endsWith("semantic.dark.json"),
          options: { selector: '[data-theme="dark"]', outputReferences: false },
        },
      ],
    },
  },
});
const darkBody = await emitCss(dark, "_tokens-dark.tmp.scss");

// ---------------------------------------------------------------------------
// @layer brand — [data-brand] overrides/extensions of the identity. Wins over
// identity by layer order. KH currently uses a parallel --kh-* namespace.
// TODO: brand population should ultimately be applied by consumers; KH is here
// for testing. A brand that overrides a *shared* contract token must supply its
// own per-theme block (e.g. [data-brand][data-theme="dark"]) within this layer,
// since brand > identity would otherwise bleed a light value into dark.
// ---------------------------------------------------------------------------
const kh = new StyleDictionary({
  source: [
    `${TOKENS_DIR}/primitive.json`,
    `${TOKENS_DIR}/primitive.kh.json`,
    `${TOKENS_DIR}/semantic.kh.json`,
  ],
  platforms: {
    css: {
      transforms: ["name/kebab"],
      buildPath: BUILD_PATH,
      files: [
        {
          destination: "_tokens-kh.tmp.scss",
          format: "css/variables",
          filter: (token) => token.filePath.endsWith(".kh.json"),
          options: { selector: '[data-brand="kh"]', outputReferences: false },
        },
      ],
    },
  },
});
const khBody = await emitCss(kh, "_tokens-kh.tmp.scss");

// ---------------------------------------------------------------------------
// Assemble the layered stylesheet.
// ---------------------------------------------------------------------------
const header =
  "/**\n" +
  " * Do not edit directly — generated by build/style-dictionary.config.mjs.\n" +
  " * Cascade: @layer structural < identity < brand < invariants.\n" +
  " */\n";

const out =
  header +
  "\n@layer structural, identity, brand, invariants;\n\n" +
  layerBlock("structural", structuralBody) +
  "\n" +
  layerBlock("identity", `${identityBody}\n\n${darkBody}`) +
  "\n" +
  layerBlock("brand", khBody) +
  "\n" +
  "@layer invariants {\n" +
  "  /* legibility / flash / ethics floors — reserved for a later phase */\n" +
  "}\n";

await writeFile(tokensFile, out);

console.log(
  "Token build complete: _tokens.scss (@layer structural + identity[+dark] + brand=kh + invariants) and _tokens-map.scss"
);
