import tsParser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'
import { afterAll, describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'

// Wire ESLint's RuleTester to run each case as a real vitest test. Imported by the
// colocated `index.test.ts` files next to each rule. The static hooks aren't in
// RuleTester's published types, so assign through an untyped view.
const RT = RuleTester as unknown as Record<string, unknown>
RT.afterAll = afterAll
RT.it = it
RT.itOnly = it.only
RT.describe = describe

export { describe } from 'vitest'

export const ts = new RuleTester({
  languageOptions: { parser: tsParser, ecmaVersion: 2022, sourceType: 'module' },
})
export const js = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
})
export const vue = new RuleTester({
  languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' },
})
