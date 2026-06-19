# @blakedykes/ui

Brand-neutral React design system built on [Base UI](https://base-ui.com), DTCG design tokens (Style Dictionary v4), and SCSS modules. Ships compiled ESM + types + a single `style.css`.

## Install

```sh
pnpm add @blakedykes/ui
```

Requires peer dependencies `react@^19`, `react-dom@^19`, and `@base-ui/react@^1.4.1`. The package is published to GitHub Packages — consumers need `@blakedykes:registry=https://npm.pkg.github.com` in their `.npmrc`.

## Usage

```tsx
// once, at the app entry — tokens (:root + dark block) and component CSS
import "@blakedykes/ui/style.css";

import { Button } from "@blakedykes/ui";

<Button variant="solid" size="md">
  Click me
</Button>;
```

Dark mode: set `data-theme="dark"` on `<html>`. The design system never reads or writes that attribute — the app owns it.

## Development

```sh
pnpm install
pnpm tokens:build   # regenerate src/styles/_tokens*.scss from tokens/*.json
pnpm storybook      # component workbench at :6006
pnpm lint:style     # token governance (no hex/px, no primitive refs)
pnpm build          # dist/: ESM + index.d.ts + style.css
```

For the local-dev loop with a consuming app: `pnpm link --global` here, then `pnpm link --global @blakedykes/ui` in the consumer.

See [CLAUDE.md](CLAUDE.md) for architecture and conventions.
