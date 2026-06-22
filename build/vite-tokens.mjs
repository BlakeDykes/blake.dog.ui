/**
 * Vite plugin: regenerate a package's `_tokens.scss` from its token JSON as part
 * of the build graph.
 *
 * The token JSON files are not in the module graph (they're compiled to SCSS by
 * Style Dictionary, not imported), so nothing would otherwise rebuild dist when
 * a token is added or changed. This plugin runs the package's token build in
 * `buildStart` and registers each source JSON via `addWatchFile`, so under
 * `vite build --watch` a token edit regenerates the partial and rebuilds the
 * stylesheet — which is what Storybook hot-reloads from.
 *
 * `buildLayeredTokens` writes the partial only when its content changes, so the
 * regenerated file does not retrigger the watcher into a loop.
 *
 * @param {object}   opts
 * @param {() => Promise<unknown>} opts.buildTokens  regenerate this package's _tokens.scss
 * @param {string[]} opts.sources                    token files to watch for changes
 */
export function tokensPlugin({ buildTokens, sources }) {
  return {
    name: "blakedykes:tokens",
    async buildStart() {
      // throwOnError is set inside buildTokens so a bad reference surfaces as a
      // Vite build error and keeps the watcher alive rather than exiting.
      await buildTokens();
      for (const file of sources) this.addWatchFile(file);
    },
  };
}
