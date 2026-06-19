# @blakedykes/nes

## 0.2.0

### Minor Changes

- 9cd03c3: Scaffold the per-identity package architecture. A new headless `@blakedykes/core`
  (the token contract cascade + behavior-only Button/Panel/Text) is skinned by
  installable console-identity packages `@blakedykes/nes` and `@blakedykes/ps2`.
  A consumer installs one identity package and ships only that console's bytes;
  `data-identity` activates the matching token contract. Capability tokens an
  identity lacks (PS2 glow/scanline) live only in that package — no zeroed tokens.

### Patch Changes

- Updated dependencies [9cd03c3]
  - @blakedykes/core@0.2.0
