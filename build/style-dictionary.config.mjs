/**
 * Token build: tokens/*.json (DTCG) -> src/styles/_tokens.scss + _tokens-map.scss
 *
 * - _tokens.scss      :root custom properties + [data-theme="dark"] overrides (runtime-themeable)
 * - _tokens-map.scss  Sass $tokens map for compile-time math only — never shipped to consumers
 *
 * Run via `pnpm tokens:build` (cwd must be the repo root).
 */
import StyleDictionary from "style-dictionary";
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { logVerbosityLevels } from "style-dictionary/enums";

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
  primitive: ["primitive.json", "kh/primitive.kh.json"],
  semantic: ["semantic.json", "semantic.dark.json", "kh/semantic.kh.json"],
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

// ---------------------------------------------------------------------------
// Build 1: light theme (:root) custom properties + Sass map.
// outputReferences keeps the alias chain visible at runtime
// (--button-bg-solid: var(--color-accent)), which is what lets the dark
// semantic overrides cascade into component tokens.
// ---------------------------------------------------------------------------
// Note: source entries are globs — always forward slashes, even on Windows.
const light = new StyleDictionary({
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
          destination: "_tokens.scss",
          format: "css/variables",
          options: { outputReferences: true },
        },
      ],
    },
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
await light.buildAllPlatforms();

// ---------------------------------------------------------------------------
// Build 2: dark theme — semantic layer only, re-pointed at primitives,
// emitted as a [data-theme="dark"] block and appended to _tokens.scss.
// References are resolved to literals here because the primitives they point
// at live in the other build's output.
// ---------------------------------------------------------------------------
const DARK_TMP = "_tokens-dark.tmp.scss";
const dark = new StyleDictionary({
  source: [`${TOKENS_DIR}/primitive.json`, `${TOKENS_DIR}/semantic.dark.json`],
  platforms: {
    css: {
      transforms: ["name/kebab"],
      buildPath: BUILD_PATH,
      files: [
        {
          destination: DARK_TMP,
          format: "css/variables",
          filter: (token) => token.filePath.endsWith("semantic.dark.json"),
          options: { selector: '[data-theme="dark"]', outputReferences: false },
        },
      ],
    },
  },
});
await dark.buildAllPlatforms();

const tokensFile = path.join(BUILD_PATH, "_tokens.scss");
const darkTmpFile = path.join(BUILD_PATH, DARK_TMP);
const rootBlock = await readFile(tokensFile, "utf8");
const darkBlock = await readFile(darkTmpFile, "utf8");
// Drop the duplicate file-header comment from the dark output before appending.
const darkBody = darkBlock.replace(/^\/\*\*[\s\S]*?\*\/\s*/, "");
await writeFile(tokensFile, `${rootBlock}\n${darkBody}`);
await rm(darkTmpFile);

//------------------
// --- kh brand
// --- TODO: This should be applied by consumers. Only here for testing
//------------------
const BRAND_TMP = "_tokens-kh.tmp.scss"
const kh = new StyleDictionary({
  log: {
    verbosity: logVerbosityLevels.verbose
  },
  source: [
    `${TOKENS_DIR}/primitive.json`,
    `${TOKENS_DIR}/kh/primitive.kh.json`,
    `${TOKENS_DIR}/kh/semantic.kh.json`,
  ],
  platforms: {
    css: {
      transforms: ["name/kebab"],
      buildPath: BUILD_PATH,
      files: [
        {
          destination: BRAND_TMP,
          format: "css/variables",
          filter: (token) => token.filePath.endsWith(".kh.json"),
          options: { selector: '[data-brand="kh"]', outputReferences: false }
        }
      ]
    }
  }
});
await kh.buildAllPlatforms();

const brandTmpFile = path.join(BUILD_PATH, BRAND_TMP);
const brandBlock = await readFile(brandTmpFile, "utf-8");
const brandBody = brandBlock.replace(/^\/\*\*[\s\S]*?\*\/\s*/, "");
const withDark = await readFile(tokensFile, "utf8");
await writeFile(tokensFile, `${withDark}\n${brandBody}`);
await rm(brandTmpFile);

console.log(
  "Token build complete: _tokens.scss (:root + dark + kh brand) and _tokens-map.scss"
);
