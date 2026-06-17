# blake_dog_ds — Design System (`@blakedykes/ui`)

A standalone, brand-neutral React design system. Built on **Base UI** (`@base-ui/react@^1.4.1`), **DTCG design tokens** compiled by **Style Dictionary v4**, **SCSS modules**, and **Storybook**, organized by **atomic design** (atoms / molecules / organisms). Distributed as a compiled package (ESM + types + one CSS file) consumed by the `blake_dog` app frontend.

## Tooling

- **pnpm**, `"type": "module"`.
- **peerDependencies:** `react@^19`, `react-dom@^19`, `@base-ui/react@^1.4.1` (consumer provides them; avoids duplicate React). Note: the package is `@base-ui/react` (stable 1.x) — **not** the pre-1.0 `@base-ui-components/react`. `useRender` is stable in 1.x.
- **devDependencies:** `style-dictionary@^4`, `sass-embedded`, `vite`, `vite-plugin-sass-dts`, `vite-plugin-dts`, `typescript`, `prettier` (config copied from blake_dog's `.prettierrc`), `stylelint` + `stylelint-config-standard-scss`, Storybook (React-Vite builder).
- TS alias `@/` → `src/` (mirrors blake_dog).

## Token pipeline (Style Dictionary v4, three-tier DTCG)

Source of truth lives in `tokens/`:

| File                        | Tier | Contents                                                    |
| --------------------------- | ---- | ----------------------------------------------------------- |
| `tokens/primitive.json`     | 1    | Raw scales (placeholder palette until brand tokens land)    |
| `tokens/semantic.json`      | 2    | Intent aliases referencing tier 1                           |
| `tokens/semantic.dark.json` | 2    | Same keys as semantic, re-pointed primitives, for dark mode |
| `tokens/component.json`     | 3    | **Opt-in** per-component tokens; Button only to start       |

**Reference rules:** tier 2 → tier 1, tier 3 → tier 2. Never reference upward and never primitive → component. Style Dictionary errors on broken references — that's the enforcement.

`build/style-dictionary.config.mjs` emits two **generated, never hand-edited** SCSS partials into `src/styles/`:

- `_tokens.scss` — `:root` CSS custom properties + a `[data-theme="dark"]` block (from `semantic.dark.json`). Runtime-themeable.
- `_tokens-map.scss` — Sass `$tokens` map for compile-time-only use (spacing math, `@each` utility generation). **Build-internal; never shipped.**

**Critical rule:** anything themeable (colors, most spacing) must be consumed as `var(--token)`; the Sass map is only for compile-time math. Resolving a themeable value through the Sass map bakes it in at compile time and **silently breaks dark mode**.

Hand-authored: `src/styles/_mixins.scss` (focus-ring, button-variant mixins).

Scripts: `pnpm tokens:build` runs the SD config; it also runs as `prebuild`.

## Cascade layers (the precedence seam)

`_tokens.scss` is emitted inside a fixed CSS cascade declared at the top of the file:

```css
@layer structural, identity, brand, invariants;
```

Precedence is by **layer order, not selector specificity**. Later layers win; the brand layer overrides the identity layer; the invariants layer (reserved) will cap brand. What each layer holds:

| Layer        | Holds                                                                                                | Selector                       |
| ------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------ |
| `structural` | raw primitive scales (`--color-blue-*`, `--space-*`, …), literals                                    | `:root`                        |
| `identity`   | the **contract** (semantic) + component tokens; `:root` is the **default identity** + the dark remap | `:root`, `[data-theme="dark"]` |
| `brand`      | `[data-brand]` overrides/extensions of the identity (KH today)                                       | `[data-brand="kh"]`            |
| `invariants` | reserved — legibility / flash / ethics floors (a later phase)                                        | —                              |

Rules and reserved slots:

- **Components read only the contract names** (`--color-*`, `--button-*`); they never compete on specificity and never read primitives directly (stylelint-enforced).
- `:root` **is** the default identity. A named identity (e.g. `[data-identity="ps2"]`) would populate the same contract inside `@layer identity`; the `[data-identity]` slot is reserved and **optional**, so existing consumers (no `data-identity`) stay themed.
- Dark wins over the default identity by **source order within the same layer** (`[data-theme="dark"]` is appended after the `:root` identity block).
- A brand that overrides a **shared contract token** must supply its own per-theme block within `@layer brand` (e.g. `[data-brand][data-theme="dark"]`), because brand > identity would otherwise bleed a light value into dark. This is solved by layer order, not the old specificity hack.
- **Consumer boundary:** layered DS declarations lose to **any unlayered** declaration a consumer makes — so a consumer's app-local `--color-*` overrides reliably win (intended).

This layering is **non-breaking**: resolved values for `:root`, `[data-theme="dark"]`, and `[data-brand="kh"]` are identical to the previous specificity-based output.

## Theming contract

- Dark mode overrides the **semantic layer only**, emitted as the `[data-theme="dark"]` block in `_tokens.scss`.
- The DS **never reads or sets** `data-theme` — the consuming app owns that attribute on `<html>`. The DS only ships tokens for both states. This is the entire theming contract with consumers.

## Components

- Layout: `src/components/atoms/` · `molecules/` · `organisms/`.
- Each component is a folder with `Name.tsx` + `Name.module.scss` + `Name.stories.tsx` + barrel.
- `Name.tsx`: Base UI `useRender` wrapper, `forwardRef`, polymorphic.
- **Variants via data-attributes** (matches Base UI's `data-*` state convention): props map to `data-variant` / `data-size`; SCSS selects on `[data-variant="solid"]`, `:hover:not(:disabled)`, `[data-checked]`, `:focus-visible`. Components never compute visual state in JS.
- **`Button` is the canonical reference component** and the tier-3 `component.json` exemplar — copy its conventions for everything that follows.
- Migration queue from blake_dog's `src/ui/shared/` (rebuild per the conventions here, fixing known bugs — do not port as-is): `Text` (fix `text` prop → `children`, remove `color:red` stub), `Heading` (rename from `Header`), `Link` (fix className merge order), `Toggle`, `Box`/`Stack` (from `Flex`), `Navigation`.

### Component SCSS rules

- Kebab-case class names only; pattern `category-property-variant-state`.
- **No hard-coded hex or px values.**
- **No primitive token refs** (`--color-*-NNN`) in component SCSS — only semantic (`--color-*`) and component (`--button-*`) tokens. Stylelint enforces this (see Governance).

## Build & distribution

- **Vite library mode**, entry `src/index.ts` (barrel of all public components). Output: `dist/` ESM + `.d.ts` via `vite-plugin-dts`. React and Base UI externalized (peer deps).
- **CSS:** all `*.module.scss` (hashed classes baked into the JS) plus `src/styles/index.scss` (which `@forward`s `_tokens.scss` so the `:root` custom props ship) compile into a **single `dist/style.css`**.
- `package.json`: `exports` maps `"."` → JS + types and `"./style.css"` → the stylesheet; set `files`, `sideEffects: ["*.css"]`, `peerDependencies`.
- Consumers get compiled JS + CSS custom properties — never source SCSS, never the Sass token map.

## Storybook

- React-Vite builder; stories organized atoms → molecules → organisms.
- A "Tokens" docs page renders swatches/scales from the generated custom props.
- A toolbar theme toggle sets `data-theme` so dark mode is testable in isolation.

## Governance & CI

- **Stylelint:** (1) flag primitive refs (`--color-*-[0-9]`) outside `_tokens.scss`; (2) no hard-coded hex/px in component SCSS. Allowlist documented exceptions (e.g. data-vis) explicitly. Style Dictionary enforces token reference direction at build.
- **CI (GitHub Actions):** `tokens:build` → `stylelint` → `tsc` → `build` → Storybook build.
- **Publish:** scoped package to **GitHub Packages**. `.npmrc` with `@scope:registry=https://npm.pkg.github.com`, `publishConfig` in `package.json`, release workflow triggered by a version tag. Manual `pnpm version` + tag for now; Changesets is a later iteration.

## Consumer: blake_dog

The first (and currently only) consumer is the `blake_dog` repo's `frontend/` (React 19 + Vite + pnpm; **not** a pnpm workspace).

- **Local dev loop:** here run `pnpm link --global`; in `blake_dog/frontend/` run `pnpm link --global @blakedykes/ui`.
- **Integration contract:** blake_dog imports `@blakedykes/ui/style.css` once in `main.tsx` (delivers tokens + dark block + component CSS) and its `ThemeProvider` sets `data-theme` on `<html>`. Nothing else crosses the boundary.
- blake_dog keeps app-coupled pieces (admin layout/drawer, login form, page scaffold, its `themeToggle` wrapper) rebuilt **on top of** DS primitives; the generic primitives in its `src/ui/shared/` get deleted once their DS replacements ship.
- The DS stays brand-neutral for now: blake_dog's Convection `@font-face` and brand palette remain app-local until brand tokens are introduced here.

## Verification checklist

1. `pnpm tokens:build` regenerates both partials with no broken-reference errors.
2. `pnpm stylelint` passes — and deliberately adding a primitive ref in component SCSS **fails** it (governance proof).
3. `pnpm build` → `dist/` contains ESM, `index.d.ts`, and a single `style.css` with the `:root` custom props + `[data-theme="dark"]` block.
4. `pnpm storybook` → all tiers render; the toolbar theme toggle recolors everything; the Tokens page shows swatches.

## Out of scope (next iterations)

Real brand palette + brand font in tokens; `Input` (stress-tests tier 3); Changesets release automation; Figma Variables ↔ Tokens Studio sync; visual-regression/a11y automation.
