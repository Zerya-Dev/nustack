const RULES_BASE = 'https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules'

export function docsUrl(rulePath: string): string {
  return `${RULES_BASE}/${rulePath}/index.md`
}
