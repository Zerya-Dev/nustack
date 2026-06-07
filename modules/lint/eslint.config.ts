// @nustackjs/lint dogfoods its own opinionated preset on its (non-Nuxt) source via
// the standalone `defineNustackConfig` entry — the same preset it applies to
// consumers, minus the Nuxt-specific concerns. Imported from `src` so linting
// tracks the source directly (no build step required).
import { defineNustackConfig } from './src/config'

export default defineNustackConfig({
  base: {
    type: 'lib',
    // The playground is its own workspace package and lints itself via the Nuxt path.
    ignores: ['dist', 'playground'],
  },
})
