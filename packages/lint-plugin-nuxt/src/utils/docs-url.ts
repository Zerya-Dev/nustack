const RULES_BASE = 'https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules'

/** Builds the GitHub URL for a rule's `index.md`, keyed by its path under `src/rules`. */
export function docsUrl(rulePath: string): string {
  return `${RULES_BASE}/${rulePath}/index.md`
}
